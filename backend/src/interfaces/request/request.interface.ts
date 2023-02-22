import { Request } from 'express';

import { Users } from '../../entities';
import { IUser } from '../user.interface';

export interface IRequest extends Request {
    user?: IUser | Users;
    email?: string;
    password?: string;
}
