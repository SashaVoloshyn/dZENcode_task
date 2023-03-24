import { Request } from 'express';

import { Comments, MainComments, Users } from '../../entities';
import { IUser } from '../user.interface';
import { IPayload } from '../token.interface';
import { IMainComment } from '../main.comment.interface';
import { IPaginationQuery } from '../queryParams/pagination.query.interface';
import { IComment } from '../comment.interface';

export interface IRequest extends Request {
    user?: IUser | Users;
    email?: string;
    password?: string;
    authorizatePassword?: string;
    authorization?: string;
    clientKey?: string;
    pageQuery?: number;
    payload?: IPayload;
    mainComment?: IMainComment | MainComments;
    pagination?: IPaginationQuery;
    comment?: IComment | Comments;
    sort?: string;
}
