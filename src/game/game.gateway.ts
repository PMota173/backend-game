import { Logger } from '@nestjs/common';
import {
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { CreatingGamePayload, JoiningGamePayload } from './game.types';

// Define a standard response structure for acknowledgements
interface SocketAckResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        [key: string]: any;
    };
}

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class GameGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(GameGateway.name);

    constructor(private readonly gameService: GameService) {}

    afterInit(server: Server) {
        this.logger.log('WebSocket server initialized: ', server);
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        // Here you might want to add logic to handle user disconnection from a game room
    }

    @SubscribeMessage('createGame')
    createGame(
        client: Socket,
        payload: CreatingGamePayload,
    ): SocketAckResponse<any> {
        this.logger.log(
            `[createGame] Client ${client.id} requested to create a game with payload: ${JSON.stringify(
                payload,
            )}`,
        );
        const newGame = this.gameService.createGame(payload);

        this.logger.log(`[createGame] Game created with ID: ${newGame.roomId}`);

        // It's often better to emit to a general lobby or namespace rather than all clients
        // but for simplicity, we'll keep emitting to all.
        this.server.emit('gameCreated', newGame);

        return { success: true, data: newGame };
    }

    @SubscribeMessage('joinGame')
    async joinGame(
        client: Socket,
        payload: JoiningGamePayload,
    ): Promise<SocketAckResponse<any>> {
        this.logger.log(
            `[joinGame] Client ${client.id} attempting to join game with payload: ${JSON.stringify(
                payload,
            )}`,
        );
        try {
            const updatedGame = this.gameService.joinGame(payload, client.id);

            await client.join(payload.roomId);
            this.logger.log(
                `[joinGame] Client ${client.id} successfully joined socket room: ${payload.roomId}`,
            );

            // Notify all clients in the room with the full game state
            this.server.to(payload.roomId).emit('gameUpdated', updatedGame);
            this.logger.log(
                `[joinGame] Emitted 'gameUpdated' to room ${payload.roomId}`,
            );

            // Acknowledge the client with success and the final game state
            return { success: true, data: updatedGame };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(
                    `[joinGame] Failed for client ${client.id} with payload: ${JSON.stringify(
                        payload,
                    )}`,
                    error.stack,
                );

                // Acknowledge the client with a structured error message
                return {
                    success: false,
                    error: {
                        message: error.message,
                        name: error.name, // e.g., 'NotFoundException'
                    },
                };
            } else {
                this.logger.error(
                    `[joinGame] Unexpected error for client ${client.id} with payload: ${JSON.stringify(
                        payload,
                    )}`,
                    error,
                );
                return {
                    success: false,
                    error: {
                        message: 'An unexpected error occurred.',
                    },
                };
            }
        }
    }

    @SubscribeMessage('startGame')
    startGame(client: Socket, payload: any): string {
        // This logic would also be moved to the service
        this.logger.log(
            `[startGame] Event received from ${client.id} with data: ${JSON.stringify(
                payload,
            )}`,
        );
        return 'Game Started!'; // This should also be a structured response
    }
}
