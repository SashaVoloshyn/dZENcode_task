import { NextFunction, Response } from 'express';

import { IPayload, IRequest, IUser } from '../interfaces';
import { clientKeySchema, loginSchema, tokenSchema, userSchema } from '../utils';
import { ErrorHandler } from '../errors';
import { HttpMessageEnum, HttpStatusEnum } from '../enums';
import { usersRepository } from '../repositories/users.repository';
import { authConstants, errorMessageConstants } from '../constants';
import { bcryptService, jwtService } from '../services';
import { Users } from '../entities';
import { clientRepository } from '../repositories/client.repository';

class AuthMiddleware {
    public registrationBodyValidate(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const { value, error } = userSchema.validate(req.body);
            if (error) {
                next(new ErrorHandler(error.message, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }
            req.user = value;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkUserIsUniq(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.user as IUser;
            const user = await usersRepository.getOneByEmail(email);

            if (user) {
                next(new ErrorHandler(errorMessageConstants.userAlreadyExists, HttpStatusEnum.CONFLICT, HttpMessageEnum.CONFLICT));
                return;
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    public loginBodyValidate(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const { value, error } = loginSchema.validate(req.body);
            if (error) {
                next(new ErrorHandler(error.message, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
            }

            req.authorizatePassword = value.password;
            req.email = value.email;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkUserExistByEmail(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const email = req.email as string;
            const user = await usersRepository.getOneByEmail(email);
            if (!user) {
                next(new ErrorHandler(errorMessageConstants.userNotFound, HttpStatusEnum.NOT_FOUND, HttpMessageEnum.NOT_FOUND));
                return;
            }
            req.user = user as IUser;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkUserPassword(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const password = req.authorizatePassword as string;
            const { password: passwordFromDB } = req.user as Users;

            const resultAfterChecked = await bcryptService.compare(password, passwordFromDB);

            if (!resultAfterChecked) {
                next(new ErrorHandler(errorMessageConstants.unauthorized, HttpStatusEnum.UNAUTHORIZED, HttpMessageEnum.UNAUTHORIZED));
                return;
            }
            next();
        } catch (e) {
            next(e);
        }
    }

    public async authorization(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const authorization = req.get(authConstants.AUTHORIZATION) as string;

            if (!authorization) {
                next(new ErrorHandler(errorMessageConstants.authorization, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }

            req.authorization = authorization;
            next();
        } catch (e) {
            next(e);
        }
    }

    public isClientKey(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const { body } = req;

            const { error } = clientKeySchema.validate(body);

            if (error) {
                next(new ErrorHandler(error.message, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }

            const { clientKey } = body;
            req.clientKey = clientKey;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkAuthorizationOnBearer(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const authorization = req.authorization as string;
            const bearer = authorization.split(' ')[0];

            if (bearer !== authConstants.BEARER) {
                next(new ErrorHandler(errorMessageConstants.authorization, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    public validateAuthorizationToken(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const authorization = req.authorization as string;
            const token = authorization.split(' ')[1];

            if (!token) {
                next(new ErrorHandler(errorMessageConstants.authorization, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                return;
            }

            const { error } = tokenSchema.validate({ token });

            if (error) {
                next(new ErrorHandler(error.message, HttpStatusEnum.BAD_REQUEST, HttpMessageEnum.BAD_REQUEST));
                next();
                return;
            }

            req.authorization = token;

            next();
        } catch (e) {
            next(e);
        }
    }

    public async verifyAccessToken(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.authorization as string;
            const { userName, id } = jwtService.verify(token) as IPayload;

            if (!userName && !id) {
                next(new ErrorHandler(errorMessageConstants.unauthorized, HttpStatusEnum.UNAUTHORIZED, HttpMessageEnum.UNAUTHORIZED));
                return;
            }

            req.payload = { userName, id };
            next();
        } catch (e) {
            next(e);
        }
    }

    public async verifyRefreshToken(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.authorization as string;
            const { userName, id } = jwtService.verify(token, authConstants.REFRESH) as IPayload;

            if (!userName || !id) {
                next(new ErrorHandler(errorMessageConstants.unauthorized, HttpStatusEnum.UNAUTHORIZED, HttpMessageEnum.UNAUTHORIZED));
                return;
            }

            req.payload = { userName, id };
            next();
        } catch (e) {
            next(e);
        }
    }

    public async wasItIssuedToken(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const key = req.clientKey as string;

            const keyFromDB = await clientRepository.getKey(key);

            if (!keyFromDB) {
                next(new ErrorHandler(errorMessageConstants.unauthorized, HttpStatusEnum.UNAUTHORIZED, HttpMessageEnum.UNAUTHORIZED));
                return;
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkUserAuthByPayload(req: IRequest, _: Response, next: NextFunction): Promise<void> {
        try {
            const { id: idPayload } = req.payload as IPayload;
            const id = Number(idPayload) as number;
            const user = await usersRepository.getOneById(id);

            if (!user) {
                next(new ErrorHandler(errorMessageConstants.userNotFound, HttpStatusEnum.NOT_FOUND, HttpMessageEnum.NOT_FOUND));
                return;
            }

            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();
