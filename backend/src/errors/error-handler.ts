import { HttpMessageEnum, HttpStatusEnum } from '../enums';

export class ErrorHandler extends Error {
    status: number | HttpStatusEnum;

    message: string;

    error: HttpMessageEnum | null;

    constructor(message: string, status: number | HttpStatusEnum, error: HttpMessageEnum | null) {
        super(message);

        this.status = status;
        this.error = error;

        Error.captureStackTrace(this, this.constructor);
    }
}
