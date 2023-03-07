export interface IUser {
    userName: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface IUserRes {
    id: number;
    userName: string;
    email: string;
    password?: string;
    avatar?: string;
}
