import { Request } from 'express';

import { Users } from '../../entities';
import { IUser } from '../user.interface';
import { IPayload } from '../token.interface';

export interface IRequest extends Request {
    user?: IUser | Users;
    email?: string;
    password?: string;
    authorizatePassword?: string;
    authorization?: string;
    clientKey?: string;
    pageQuery?: number;
    payload?: IPayload;
}
