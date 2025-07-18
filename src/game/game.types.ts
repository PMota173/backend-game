export interface Player {
    id: string;
    name: string;
}

export interface GameRoom {
    roomId: string;
    roomName: string;
    players: Player[];
    limit: number;
    roomStatus: RoomStatus;
}

export enum RoomStatus {
    WAITING = 'WAITING',
    PLAYING = 'PLAYING',
    FINISHED = 'FINISHED',
}

export interface JoiningGamePayload {
    roomId: string;
    playerName: string;
}

export interface CreatingGamePayload {
    roomName: string;
}

export interface StartingGamePayload {
    roomId: string;
}
