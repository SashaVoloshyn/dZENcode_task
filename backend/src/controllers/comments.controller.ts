import { NextFunction } from 'express';

import { IComment, IFileExtended, IRequest, IResponse } from '../interfaces';
import { Comments } from '../entities';
import { commentsRepository } from '../repositories';
import { ErrorHandler } from '../errors';
import { errorMessageConstants } from '../constants';
import { FileEnum, HttpMessageEnum, HttpStatusEnum, ItemTypeFileEnum } from '../enums';
import { s3Service } from '../services';
import { mainConfig } from '../configs';

class CommentsController {
    public async getAll(
        _: IRequest,
        res: IResponse<Comments[] | null>,
        next: NextFunction
    ): Promise<IResponse<Comments[]> | null | undefined> {
        try {
            const allComments = await commentsRepository.getAll();
            if (!allComments) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.notFound,
                        HttpStatusEnum.NOT_FOUND,
                        HttpMessageEnum.NOT_FOUND
                    )
                );
            }

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                data: allComments,
                message: HttpMessageEnum.OK,
            });
        } catch (e) {
            next(e);
        }
    }

    public async createOne(
        req: IRequest,
        res: IResponse<IComment | null>,
        next: NextFunction
    ): Promise<IResponse<IComment> | undefined> {
        try {
            const { mainCommentId, text, fileText, fileImg, userId } = req.comment as IComment;

            const commentCreated = await commentsRepository.createOne({
                mainCommentId,
                text,
                fileText,
                fileImg,
                userId,
            });

            if (req.file && !req.files) {
                if (req.comment?.fileText && !req.comment?.fileImg) {
                    const textFileSave = await s3Service.uploadFile(
                        req.file,
                        commentCreated.id,
                        FileEnum.TEXTS,
                        ItemTypeFileEnum.COMMENTS
                    );

                    if (!textFileSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...commentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = textFileSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await commentsRepository.updateOne(commentCreated.id, { fileText: pathFile });
                }

                if (!req.comment?.fileText && req.comment?.fileImg) {
                    const imgFileSave = await s3Service.uploadFile(
                        req.file,
                        commentCreated.id,
                        FileEnum.PHOTOS,
                        ItemTypeFileEnum.COMMENTS
                    );

                    if (!imgFileSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...commentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = imgFileSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await commentsRepository.updateOne(commentCreated.id, { fileImg: pathFile });
                }
            }

            if (!req.file && req.files) {
                const files = req.files as IFileExtended;
                if (files.fileText) {
                    const fileTextElement = files.fileText[0];
                    const textSave = await s3Service.uploadFile(
                        fileTextElement,
                        commentCreated.id,
                        FileEnum.TEXTS,
                        ItemTypeFileEnum.COMMENTS
                    );

                    if (!textSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...commentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = textSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await commentsRepository.updateOne(commentCreated.id, { fileText: pathFile });
                }

                if (files.fileImg) {
                    const fileImgElement = files.fileImg[0];
                    const imgSave = await s3Service.uploadFile(
                        fileImgElement,
                        commentCreated.id,
                        FileEnum.PHOTOS,
                        ItemTypeFileEnum.COMMENTS
                    );

                    if (!imgSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...commentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = imgSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await commentsRepository.updateOne(commentCreated.id, { fileImg: pathFile });
                }
            }

            const commentResponse = await commentsRepository.getOneById(commentCreated.id);

            return res.status(HttpStatusEnum.CREATED).json({
                status: HttpStatusEnum.CREATED,
                data: commentResponse,
                message: HttpMessageEnum.CREATED,
            });
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(
        req: IRequest,
        res: IResponse<HttpMessageEnum.NO_CONTENT>,
        next: NextFunction
    ): Promise<IResponse<HttpMessageEnum.NO_CONTENT> | undefined> {
        try {
            const comment = req.comment as Comments;

            await commentsRepository.deleteOneById(comment.id);

            if (comment.fileText) {
                await s3Service.deleteFile(comment.fileText);
            }

            if (comment.fileImg) {
                await s3Service.deleteFile(comment.fileImg);
            }

            return res.status(HttpStatusEnum.NO_CONTENT).json({
                status: HttpStatusEnum.NO_CONTENT,
                data: HttpMessageEnum.NO_CONTENT,
                message: HttpMessageEnum.NO_CONTENT,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const commentsController = new CommentsController();
