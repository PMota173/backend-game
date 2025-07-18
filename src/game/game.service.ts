import {
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreatingGamePayload, GameRoom, RoomStatus } from './game.types';
import { JoiningGamePayload } from './game.types';
import { StartingGamePayload } from './game.types';

@Injectable()
export class GameService {
    private readonly logger = new Logger(GameService.name);
    private gameRooms: Map<string, GameRoom> = new Map();

    createGame(payload: CreatingGamePayload): GameRoom {
        let roomId: string;
        do {
            roomId = Math.floor(10000000 + Math.random() * 90000000).toString();
        } while (this.gameRooms.has(roomId));

        const newGameRoom: GameRoom = {
            roomId,
            roomName: payload.roomName,
            players: [],
            limit: 8,
            roomStatus: RoomStatus.WAITING,
        };

        this.gameRooms.set(roomId, newGameRoom);
        this.logger.log(`Game room created: ${JSON.stringify(newGameRoom)}`);

        return newGameRoom;
    }

    joinGame(payload: JoiningGamePayload, clientId: string): GameRoom {
        const { roomId, playerName } = payload;
        this.logger.log(
            `Player ${playerName} (${clientId}) attempting to join room ${roomId}`,
        );

        const gameRoom = this.gameRooms.get(roomId);
        if (!gameRoom) {
            throw new NotFoundException(
                `Game room with ID ${roomId} not found.`,
            );
        }

        if (gameRoom.players.length >= gameRoom.limit) {
            throw new ForbiddenException(`Game room ${roomId} is full.`);
        }

        const playerExists = gameRoom.players.some(
            (player) => player.name === playerName,
        );
        if (playerExists) {
            throw new ConflictException(
                `Player name ${playerName} is already taken in room ${roomId}.`,
            );
        }

        const newPlayer = { id: clientId, name: playerName };
        gameRoom.players.push(newPlayer);

        this.logger.log(
            `Player ${playerName} successfully joined room ${roomId}. Current state: ${JSON.stringify(
                gameRoom,
            )}`,
        );
        return gameRoom;
    }

    startGame(payload: StartingGamePayload): GameRoom {
        const roomId = payload.roomId;

        const gameRoom = this.gameRooms.get(roomId);
        if (!gameRoom) {
            throw new NotFoundException(
                `Game room with ID ${roomId} not found.`,
            );
        }

        if (gameRoom.roomStatus !== RoomStatus.WAITING) {
            throw new ConflictException(
                `Game room ${roomId} cannot be started. Current status: ${gameRoom.roomStatus}`,
            );
        }

        if (gameRoom.players.length < 3) {
            throw new ForbiddenException(
                `Game room ${roomId} requires at least 3 players to start.`,
            );
        }

        // Set the game room status to PLAYING
        gameRoom.roomStatus = RoomStatus.PLAYING;
        this.logger.log(
            `Game room ${roomId} started. Current state: ${JSON.stringify(
                gameRoom,
            )}`,
        );
        return gameRoom;
    }
}
