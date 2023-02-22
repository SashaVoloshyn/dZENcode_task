export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
    clientKey: string;
}

export interface IPayload {
    userName?: string;
    id?: number;
    email?: string;
}
