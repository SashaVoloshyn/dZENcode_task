import { NextFunction, Response } from 'express';

import { IRequest, IResponse } from '../interfaces';
import { ErrorHandler } from '../errors';
import { HttpMessageEnum, HttpStatusEnum } from '../enums';
import { commentsSchema } from '../utils';
import { commentsRepository, mainCommentsRepository } from '../repositories';
import { errorMessageConstants } from '../constants';
import { Comments } from '../entities';

class CommentMiddleware {
    public validateBody(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const { body } = req;

            const { value, error } = commentsSchema.validate(body);

            if (error) {
                next(new ErrorHandler(error.message, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }
            req.comment = value;

            req.clientKey = value.clientKey;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkMainCommentExistsById(req: IRequest, _: IResponse<any>, next: NextFunction): Promise<void> {
        try {
            const { mainCommentId } = req.comment!;

            const mainComment = await mainCommentsRepository.getOneById(mainCommentId);

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
            req.mainComment = mainComment;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async cheUser(req: IRequest, _: IResponse<any>, next: NextFunction): Promise<void> {
        const userKey = req.clientKey!.split(':');
        if (Number(userKey[2]) !== Number(req.body.userId)) {
            next(
                new ErrorHandler(
                    errorMessageConstants.badRequest,
                    HttpStatusEnum.BAD_REQUEST,
                    HttpMessageEnum.BAD_REQUEST
                )
            );
            return;
        }

        next();
    }

    public async checkCommentExistsById(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id!;

            const comment = await commentsRepository.getOneById(Number(id));

            if (!comment) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.notFound,
                        HttpStatusEnum.NOT_FOUND,
                        HttpMessageEnum.NOT_FOUND
                    )
                );
                return;
            }

            req.comment = comment as Comments;

            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkUserIsdAuthor(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const authorId = req.comment?.userId;
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

export const commentMiddleware = new CommentMiddleware();
