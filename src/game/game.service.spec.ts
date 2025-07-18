// src/game/game.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { RoomStatus } from './game.types';

describe('GameService', () => {
    let service: GameService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GameService],
        }).compile();

        service = module.get<GameService>(GameService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('startGame', () => {
        it('should start the game if conditions are met', () => {
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

            const updatedGame = service.startGame({ roomId: game.roomId });
            expect(updatedGame.roomStatus).toBe(RoomStatus.PLAYING);
        });

        it('should throw NotFoundException if the room does not exist', () => {
            expect(() =>
                service.startGame({ roomId: 'non-existent-room' }),
            ).toThrow(NotFoundException);
        });

        it('should throw ConflictException if the game is not in WAITING state', () => {
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

            service.startGame({ roomId: game.roomId }); // Game is now PLAYING

            expect(() => service.startGame({ roomId: game.roomId })).toThrow(
                ConflictException,
            );
        });

        it('should throw ForbiddenException if there are not enough players', () => {
            const game = service.createGame({ roomName: 'Test Room' });
            service.joinGame(
                { roomId: game.roomId, playerName: 'Player 1' },
                '1',
            );

            expect(() => service.startGame({ roomId: game.roomId })).toThrow(
                ForbiddenException,
            );
        });
    });
});
