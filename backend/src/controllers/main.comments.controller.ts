import { NextFunction } from 'express';

import { MainComments } from '../entities';
import { IFileExtended, IMainComment, IRequest, IResponse } from '../interfaces';
import { mainCommentsRepository } from '../repositories';
import { ErrorHandler } from '../errors';
import { errorMessageConstants } from '../constants';
import { FileEnum, HttpMessageEnum, HttpStatusEnum, ItemTypeFileEnum } from '../enums';
import { paginationService, s3Service } from '../services';
import { mainConfig } from '../configs';

class MainCommentsController {
    public async getOneById(
        req: IRequest,
        res: IResponse<MainComments>,
        next: NextFunction
    ): Promise<IResponse<MainComments> | undefined> {
        try {
            const { params } = req;

            const mainComment = await mainCommentsRepository.getOneById(Number(params.id));

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

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                data: mainComment,
                message: HttpMessageEnum.OK,
            });
        } catch (e) {
            next(e);
        }
    }

    public async createOne(
        req: IRequest,
        res: IResponse<MainComments | null>,
        next: NextFunction
    ): Promise<IResponse<MainComments> | null | undefined> {
        try {
            const mainComment = req.body as IMainComment;

            const mainCommentCreated = await mainCommentsRepository.createOne(mainComment);

            if (req.file && !req.files) {
                if (mainComment?.fileText && !mainComment?.fileImg) {
                    const textFileSave = await s3Service.uploadFile(
                        req.file,
                        mainCommentCreated.id,
                        FileEnum.TEXTS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    if (!textFileSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...mainCommentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = textFileSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(mainCommentCreated.id, { fileText: pathFile });
                }

                if (!mainComment?.fileText && mainComment?.fileImg) {
                    const imgFileSave = await s3Service.uploadFile(
                        req.file,
                        mainCommentCreated.id,
                        FileEnum.PHOTOS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    if (!imgFileSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...mainCommentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = imgFileSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(mainCommentCreated.id, { fileImg: pathFile });
                }
            }

            if (!req.file && req.files) {
                const files = req.files as IFileExtended;
                if (files.fileText) {
                    const fileTextElement = files.fileText[0];
                    const textSave = await s3Service.uploadFile(
                        fileTextElement,
                        mainCommentCreated.id,
                        FileEnum.TEXTS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    if (!textSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...mainCommentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = textSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(mainCommentCreated.id, { fileText: pathFile });
                }

                if (files.fileImg) {
                    const fileImgElement = files.fileImg[0];
                    const imgSave = await s3Service.uploadFile(
                        fileImgElement,
                        mainCommentCreated.id,
                        FileEnum.PHOTOS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    if (!imgSave.Location) {
                        return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                            status: HttpStatusEnum.PARTIAL_CONTENT,
                            data: { ...mainCommentCreated },
                            message: HttpMessageEnum.PARTIAL_CONTENT,
                        });
                    }

                    const pathFile = imgSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(mainCommentCreated.id, { fileImg: pathFile });
                }
            }

            const mainCommentResponse = await mainCommentsRepository.getOneById(mainCommentCreated.id);

            if (!mainCommentCreated) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.unknown,
                        HttpStatusEnum.NOT_IMPLEMENTED,
                        HttpMessageEnum.NOT_IMPLEMENTED
                    )
                );
            }

            return res.status(HttpStatusEnum.CREATED).json({
                status: HttpStatusEnum.CREATED,
                data: mainCommentResponse,
                message: HttpMessageEnum.CREATED,
            });
        } catch (e) {
            next(e);
        }
    }

    public async getAll(
        _: IRequest,
        res: IResponse<MainComments[]>,
        next: NextFunction
    ): Promise<IResponse<MainComments[]> | undefined> {
        try {
            const mainComments = await mainCommentsRepository.getAll();
            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                data: mainComments,
                message: HttpMessageEnum.OK,
            });
        } catch (e) {
            next(e);
        }
    }

    public async getAllWithPagination(
        req: IRequest,
        res: IResponse<[MainComments[], number]>,
        next: NextFunction
    ): Promise<IResponse<[MainComments[], number]> | undefined> {
        try {
            let page = Number(req.pagination?.page);
            let perPage = Number(req.pagination?.perPage);

            if (!page) page = 1;
            if (!perPage) perPage = 25;

            const skip = paginationService.createSkip(page, perPage);

            const mainComments = await mainCommentsRepository.getAllWithPagination(skip, perPage);

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                data: mainComments,
                message: HttpMessageEnum.OK,
            });
        } catch (e) {
            next(e);
        }
    }

    public async deleteOne(
        req: IRequest,
        res: IResponse<HttpMessageEnum.NO_CONTENT>,
        next: NextFunction
    ): Promise<IResponse<HttpMessageEnum.NO_CONTENT> | undefined> {
        try {
            const mainComment = req.mainComment as MainComments;
            await mainCommentsRepository.deleteOne(mainComment.id);

            if (mainComment.fileText) {
                await s3Service.deleteFile(mainComment.fileText);
            }

            if (mainComment.fileImg) {
                await s3Service.deleteFile(mainComment.fileImg);
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

    public async updateOne(
        req: IRequest,
        res: IResponse<IMainComment | null>,
        next: NextFunction
    ): Promise<IResponse<MainComments> | undefined> {
        try {
            const id = req.params.id!;
            const { userId, pageUrl, text, fileText, fileImg } = req.mainComment!;

            if (req.file && !req.files) {
                if (req.mainComment?.fileText && !req.mainComment?.fileImg) {
                    const textSave = await s3Service.uploadFile(
                        req.file,
                        Number(id),
                        FileEnum.TEXTS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    const pathFile = textSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(Number(id), { fileText: pathFile });
                }

                if (!req.mainComment?.fileText && req.mainComment?.fileImg) {
                    const imgSave = await s3Service.uploadFile(
                        req.file,
                        Number(id),
                        FileEnum.PHOTOS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    const pathFile = imgSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(Number(id), { fileImg: pathFile });
                }
            }

            if (!req.file && req.files) {
                const files = req.files as IFileExtended;
                if (files.fileText) {
                    const fileTextElement = files.fileText[0];
                    const textSave = await s3Service.uploadFile(
                        fileTextElement,
                        Number(id),
                        FileEnum.TEXTS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    const pathFile = textSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(Number(id), { fileText: pathFile });
                }

                if (files.fileImg) {
                    const fileImgElement = files.fileImg[0];
                    const imgSave = await s3Service.uploadFile(
                        fileImgElement,
                        Number(id),
                        FileEnum.PHOTOS,
                        ItemTypeFileEnum.MAINCOMMENTS
                    );

                    const pathFile = imgSave.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                    await mainCommentsRepository.updateOne(Number(id), { fileImg: pathFile });
                }
            }

            await mainCommentsRepository.updateOne(Number(id), { userId, pageUrl, text, fileText, fileImg });

            const mainCommentRes = await mainCommentsRepository.getOneById(Number(id));

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                data: mainCommentRes,
                message: HttpMessageEnum.OK,
            });
        } catch (e) {
            next(e);
        }
    }
}

export const mainCommentsController = new MainCommentsController();
