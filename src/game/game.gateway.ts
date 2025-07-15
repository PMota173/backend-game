import {
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for CORS
        methods: ['GET', 'POST'], // Allow GET and POST methods
        credentials: true, // Allow credentials
    },
})
export class GameGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    afterInit(server: Server) {
        console.log('WebSocket server initialized', server);
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    constructor() {
        console.log('GameGateway initialized');
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): string {
        console.log('Received message:', payload);

        return 'Hello world!';
    }
}
