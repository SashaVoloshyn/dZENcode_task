import { Response } from 'express';

import { HttpMessageEnum, HttpStatusEnum } from '../../enums';

type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

export interface IResponse<T> extends Response {
    json: Send<
        {
            status: HttpStatusEnum;
            data: T;
            message: HttpMessageEnum;
        },
        this
    >;
}
