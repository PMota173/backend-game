import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { io, Socket } from 'socket.io-client';
import { AddressInfo } from 'net';

interface GameCreatedPayload {
    roomId: string | undefined;
    roomName: string;
}

describe('GameGateway (e2e)', () => {
    let app: INestApplication;
    let clientSocket1: Socket;
    let clientSocket2: Socket;
    let port: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.listen(0);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const address = app.getHttpServer().address() as AddressInfo;
        port = address.port;
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach((done) => {
        clientSocket1 = io(`http://localhost:${port}`);
        clientSocket2 = io(`http://localhost:${port}`);
        clientSocket1.on('connect', () => {
            clientSocket2.on('connect', () => {
                done();
            });
        });
    });

    afterEach(() => {
        clientSocket1.close();
        clientSocket2.close();
    });

    it('should broadcast "gameCreated" event to all clients when a game is created', (done) => {
        const gameData = { roomName: 'Test Room' };
        let client1Received = false;
        let client2Received = false;

        clientSocket1.on('gameCreated', (payload: GameCreatedPayload) => {
            expect(payload.roomName).toBe(gameData.roomName);
            client1Received = true;
            if (client2Received) {
                done();
            }
        });

        clientSocket2.on('gameCreated', (payload: GameCreatedPayload) => {
            expect(payload.roomName).toBe(gameData.roomName);
            client2Received = true;
            if (client1Received) {
                done();
            }
        });

        clientSocket1.emit('createGame', gameData);
    });
});
