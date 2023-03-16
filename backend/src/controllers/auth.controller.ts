import { NextFunction } from 'express';

import { IPayload, IRequest, IResponse, ITokenPair, IUser, IUserRes } from '../interfaces';
import { Users } from '../entities';
import { bcryptService, jwtService, s3Service } from '../services';
import { clientRepository, usersRepository } from '../repositories';
import { ErrorHandler } from '../errors';
import { FileEnum, HttpMessageEnum, HttpStatusEnum, ItemTypeFileEnum } from '../enums';
import { errorMessageConstants } from '../constants';
import { mainConfig } from '../configs';

class AuthController {
    public async registration(
        req: IRequest,
        res: IResponse<Users>,
        next: NextFunction
    ): Promise<IResponse<Users> | undefined> {
        try {
            const { userName, email, password, avatar } = req.body as IUser;

            const hashPassword = await bcryptService.hashPassword(password);

            const userDB = await usersRepository.createOne({ userName, email, password: hashPassword, avatar });

            if (!userDB) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.userNotRegistration,
                        HttpStatusEnum.NOT_IMPLEMENTED,
                        HttpMessageEnum.NOT_IMPLEMENTED
                    )
                );
                return;
            }

            if (req.file) {
                const userId = userDB.id;
                const avatarSaved = await s3Service.uploadFile(
                    req.file,
                    userId,
                    FileEnum.AVATARS,
                    ItemTypeFileEnum.USERS
                );

                if (!avatarSaved.Location) {
                    return res.status(HttpStatusEnum.PARTIAL_CONTENT).json({
                        status: HttpStatusEnum.PARTIAL_CONTENT,
                        data: { ...userDB },
                        message: HttpMessageEnum.PARTIAL_CONTENT,
                    });
                }
                const pathFile = avatarSaved.Location.split(mainConfig.CLOUD_DOMAIN_NAME!)[1];

                await usersRepository.updateAvatar(userId, pathFile);
                return res.status(HttpStatusEnum.CREATED).json({
                    status: HttpStatusEnum.CREATED,
                    data: { ...userDB, avatar: pathFile },
                    message: HttpMessageEnum.CREATED,
                });
            }

            return res.status(HttpStatusEnum.CREATED).json({
                status: HttpStatusEnum.CREATED,
                data: userDB,
                message: HttpMessageEnum.CREATED,
            });
        } catch (e) {
            next(e);
        }
    }

    public async login(
        req: IRequest,
        res: IResponse<ITokenPair>,
        next: NextFunction
    ): Promise<IResponse<ITokenPair> | undefined> {
        try {
            const { userName, id } = req.user as Users;

            const tokensPairGenerate = await jwtService.generateTokenPair({ id, userName });

            if (!tokensPairGenerate) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.unknown,
                        HttpStatusEnum.INTERNAL_SERVER_ERROR,
                        HttpMessageEnum.INTERNAL_SERVER_ERROR
                    )
                );
                return;
            }
            const { accessToken, refreshToken, clientKey } = tokensPairGenerate;

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                message: HttpMessageEnum.OK,
                data: {
                    accessToken,
                    refreshToken,
                    clientKey,
                },
            });
        } catch (e) {
            next(e);
        }
    }

    public async logout(
        req: IRequest,
        res: IResponse<number>,
        next: NextFunction
    ): Promise<IResponse<number> | undefined> {
        try {
            const clientKey = req.clientKey as string;
            const deletedTokens = await clientRepository.delete(clientKey);

            if (!deletedTokens) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.unknown,
                        HttpStatusEnum.INTERNAL_SERVER_ERROR,
                        HttpMessageEnum.INTERNAL_SERVER_ERROR
                    )
                );
                return;
            }

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                message: HttpMessageEnum.OK,
                data: deletedTokens,
            });
        } catch (e) {
            next(e);
        }
    }

    public async refresh(
        req: IRequest,
        res: IResponse<ITokenPair>,
        next: NextFunction
    ): Promise<IResponse<ITokenPair> | undefined> {
        try {
            const reqClientKey = req.clientKey as string;
            const payload = req.payload as IPayload;

            const numbDeleted = await clientRepository.delete(reqClientKey);
            if (!numbDeleted) {
                return;
            }

            const newTokens = await jwtService.generateTokenPair(payload);

            if (!newTokens) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.unknown,
                        HttpStatusEnum.INTERNAL_SERVER_ERROR,
                        HttpMessageEnum.INTERNAL_SERVER_ERROR
                    )
                );
                return;
            }

            const { refreshToken, accessToken, clientKey } = newTokens;

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                message: HttpMessageEnum.OK,
                data: {
                    refreshToken,
                    accessToken,
                    clientKey,
                },
            });
        } catch (e) {
            next(e);
        }
    }

    public async checkMeAuth(
        req: IRequest,
        res: IResponse<IUserRes>,
        next: NextFunction
    ): Promise<IResponse<IUserRes> | undefined> {
        try {
            const { id, userName, avatar, email } = req.user as IUserRes;

            return res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                message: HttpMessageEnum.OK,
                data: {
                    id,
                    userName,
                    avatar,
                    email,
                },
            });
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
