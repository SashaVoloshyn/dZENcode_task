import multer from 'multer';

import { errorMessageConstants, fileSizeConstant, filesMimetypeConstant } from '../constants';
import { IRequest } from '../interfaces';
import { FileEnum, HttpMessageEnum, HttpStatusEnum } from '../enums';
import { ErrorHandler } from '../errors';

class FileUploadMiddleware {
    public static userAvatar(): multer.Multer {
        return multer({
            limits: { fileSize: fileSizeConstant.SIZE_AVATAR },
            fileFilter(_: IRequest, file: Express.Multer.File, callback: multer.FileFilterCallback) {
                if (!filesMimetypeConstant[FileEnum.PHOTOS].includes(file.mimetype)) {
                    return callback(
                        new ErrorHandler(
                            errorMessageConstants.fileMimetype,
                            HttpStatusEnum.BAD_REQUEST,
                            HttpMessageEnum.BAD_REQUEST
                        )
                    );
                }

                if (fileSizeConstant.SIZE_AVATAR < file.size) {
                    return callback(
                        new ErrorHandler(
                            errorMessageConstants.fileSize,
                            HttpStatusEnum.BAD_REQUEST,
                            HttpMessageEnum.BAD_REQUEST
                        )
                    );
                }
                callback(null, true);
            },
        });
    }

    public static textPhotoFields(): multer.Multer {
        return multer({
            fileFilter(_: IRequest, file: Express.Multer.File, callback: multer.FileFilterCallback) {
                if (file.fieldname === 'fileText') {
                    if (!filesMimetypeConstant[FileEnum.TEXTS].includes(file.mimetype)) {
                        return callback(
                            new ErrorHandler(
                                errorMessageConstants.fileMimetype,
                                HttpStatusEnum.BAD_REQUEST,
                                HttpMessageEnum.BAD_REQUEST
                            )
                        );
                    }

                    if (fileSizeConstant.SIZE_TEXT_FILE < file.size) {
                        return callback(
                            new ErrorHandler(
                                errorMessageConstants.fileSize,
                                HttpStatusEnum.BAD_REQUEST,
                                HttpMessageEnum.BAD_REQUEST
                            )
                        );
                    }
                }

                if (file.fieldname === 'fileImg') {
                    if (!filesMimetypeConstant[FileEnum.PHOTOS].includes(file.mimetype)) {
                        return callback(
                            new ErrorHandler(
                                errorMessageConstants.fileMimetype,
                                HttpStatusEnum.BAD_REQUEST,
                                HttpMessageEnum.BAD_REQUEST
                            )
                        );
                    }

                    if (fileSizeConstant.SIZE_IMG < file.size) {
                        return callback(
                            new ErrorHandler(
                                errorMessageConstants.fileSize,
                                HttpStatusEnum.BAD_REQUEST,
                                HttpMessageEnum.BAD_REQUEST
                            )
                        );
                    }
                }

                callback(null, true);
            },
        });
    }
}

export const { userAvatar, textPhotoFields } = FileUploadMiddleware;
