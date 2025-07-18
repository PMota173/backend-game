import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameRoom, RoomStatus } from './game.types';
import { Server, Socket } from 'socket.io';

describe('GameGateway', () => {
    let gateway: GameGateway;
    let service: GameService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameGateway, GameService],
        }).compile();

        gateway = module.get<GameGateway>(GameGateway);
        service = module.get<GameService>(GameService);

        const serverMock = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };
        gateway.server = serverMock as unknown as Server;
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    describe('startGame', () => {
        it('should handle the startGame event and emit gameUpdated', () => {
            const game = service.createGame({ roomName: 'Test Room' });
            service.joinGame(
                { roomId: game.roomId, playerName: 'Player 1' },
                '1',
            );
            service.joinGame(
                { roomId: game.roomId, playerName: 'Player 2' },
                '2',
            );
            service.joinGame(
                { roomId: game.roomId, playerName: 'Player 3' },
                '3',
            );

            const client = { id: '1' } as Socket;
            const response = gateway.startGame(client, { roomId: game.roomId });

            expect(response.success).toBe(true);
            if (response.success) {
                expect((response.data as GameRoom).roomStatus).toBe(
                    RoomStatus.PLAYING,
                );
            }
        });
    });
});
