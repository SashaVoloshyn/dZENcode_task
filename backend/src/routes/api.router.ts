import { Request, Response, NextFunction, Router } from 'express';

import { HttpMessageEnum, HttpStatusEnum } from '../enums';
import { authRouter } from './auth.router';
import { ErrorHandler } from '../errors';
import { mainCommentsRouter } from './main.comments.router';
import { commentsRouter } from './comments.router';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/mainComments', mainCommentsRouter);
apiRouter.use('/comments', commentsRouter);

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
apiRouter.use('*', (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        error: err?.error || HttpMessageEnum.INTERNAL_SERVER_ERROR,
        status: err?.status || HttpStatusEnum.INTERNAL_SERVER_ERROR,
    });
});
