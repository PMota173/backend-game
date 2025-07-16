export interface Player {
    id: string;
    name: string;
}

export interface GameRoom {
    roomId: string;
    roomName: string;
    players: Player[];
    limit: number;
}

export interface JoiningGamePayload {
    roomId: string;
    playerName: string;
}

export interface CreatingGamePayload {
    roomName: string;
}
