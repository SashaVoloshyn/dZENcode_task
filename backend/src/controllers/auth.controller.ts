import { NextFunction } from 'express';

import { IRequest, IResponse, IUser } from '../interfaces';
import { Users } from '../entities';
import { bcryptService } from '../services';
import { usersRepository } from '../repositories/users.repository';
import { ErrorHandler } from '../errors';
import { HttpMessageEnum, HttpStatusEnum } from '../enums';
import { errorMessageConstants } from '../constants';

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

    public async login(req: IRequest, res: IResponse<IUser>, next: NextFunction): Promise<IResponse<IUser> | undefined> {
        try {
            const { userName, email, password } = req.body as Users;

            return await res.status(HttpStatusEnum.OK).json({
                status: HttpStatusEnum.OK,
                message: HttpMessageEnum.OK,
                data: {
                    userName,
                    email,
                    password,
                },
            });
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
