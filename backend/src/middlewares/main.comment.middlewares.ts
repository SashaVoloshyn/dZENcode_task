import { NextFunction, Response } from 'express';

import { IRequest } from '../interfaces';
import { ErrorHandler } from '../errors';
import { errorMessageConstants } from '../constants';
import { HttpMessageEnum, HttpStatusEnum } from '../enums';
import { mainCommentsSchema } from '../utils';
import { mainCommentsRepository } from '../repositories';
import { MainComments } from '../entities';

class MainCommentMiddlewares {
    public validateBody(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const { body } = req;

            const { value, error } = mainCommentsSchema.validate(body);

            if (error) {
                next(new ErrorHandler(error.message, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }

            const userCommentId = value.clientKey.split(':');
            if (value.userId !== Number(userCommentId[2])) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.badRequest,
                        HttpStatusEnum.BAD_REQUEST,
                        HttpMessageEnum.BAD_REQUEST
                    )
                );
                return;
            }

            req.mainComment = value;
            req.clientKey = value.clientKey;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkMainCommentExistsById(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id!;

            const mainComment = await mainCommentsRepository.getOneById(Number(id));

            if (!mainComment) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.notFound,
                        HttpStatusEnum.NOT_FOUND,
                        HttpMessageEnum.NOT_FOUND
                    )
                );
                return;
            }

            req.mainComment = mainComment as MainComments;

            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkUseridAndAuthorId(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const authorId = req.mainComment?.userId;
            const userId = req.payload?.id;

            if (Number(authorId) !== Number(userId)) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.badRequest,
                        HttpStatusEnum.BAD_REQUEST,
                        HttpMessageEnum.BAD_REQUEST
                    )
                );
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const mainCommentMiddlewares = new MainCommentMiddlewares();
