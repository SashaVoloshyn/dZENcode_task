import { NextFunction } from 'express';

import { IPayload, IRequest, IResponse, ITokenPair, IUser } from '../interfaces';
import { Users } from '../entities';
import { bcryptService, jwtService } from '../services';
import { usersRepository } from '../repositories/users.repository';
import { ErrorHandler } from '../errors';
import { HttpMessageEnum, HttpStatusEnum } from '../enums';
import { errorMessageConstants } from '../constants';
import { clientRepository } from '../repositories/client.repository';

class AuthController {
    public async registration(req: IRequest, res: IResponse<Users>, next: NextFunction): Promise<IResponse<Users> | undefined> {
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

            return res.status(HttpStatusEnum.CREATED).json({
                status: HttpStatusEnum.CREATED,
                data: userDB,
                message: HttpMessageEnum.CREATED,
            });
        } catch (e) {
            next(e);
        }
    }

    public async login(req: IRequest, res: IResponse<ITokenPair>, next: NextFunction): Promise<IResponse<ITokenPair> | undefined> {
        try {
            const { userName, id } = req.user as Users;

            const tokensPairGeneret = await jwtService.generateTokenPair({ id, userName });

            if (!tokensPairGeneret) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.unknown,
                        HttpStatusEnum.INTERNAL_SERVER_ERROR,
                        HttpMessageEnum.INTERNAL_SERVER_ERROR
                    )
                );
                return;
            }
            const { accessToken, refreshToken, clientKey } = tokensPairGeneret;

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

    public async logout(req: IRequest, res: IResponse<number>, next: NextFunction): Promise<IResponse<number> | undefined> {
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

    public async refresh(req: IRequest, res: IResponse<ITokenPair>, next: NextFunction): Promise<IResponse<ITokenPair> | undefined> {
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
}

export const authController = new AuthController();
