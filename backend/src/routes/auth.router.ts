import { Router } from 'express';

import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares';

export const authRouter = Router();

authRouter.post('/registration', authMiddleware.registrationBodyValidate, authMiddleware.checkUserIsUniq, authController.registration);

authRouter.post(
    '/login',
    authMiddleware.loginBodyValidate,
    authMiddleware.checkUserExistByEmail,
    authMiddleware.checkUserPassword,
    authController.login
);

authRouter.post(
    '/logout',
    authMiddleware.authorization,
    authMiddleware.isClientKey,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyAccessToken,
    authMiddleware.wasItIssuedToken,
    authMiddleware.checkUserAuthByPayload,
    authController.logout
);

authRouter.post(
    '/refresh',
    authMiddleware.authorization,
    authMiddleware.isClientKey,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyRefreshToken,
    authMiddleware.wasItIssuedToken,
    authMiddleware.checkUserAuthByPayload,
    authController.refresh
);
