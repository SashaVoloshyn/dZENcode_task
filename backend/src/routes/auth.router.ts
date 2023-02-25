import { Router } from 'express';

import { authController } from '../controllers';
import { authMiddleware, userAvatar } from '../middlewares';

export const authRouter = Router();
const upload = userAvatar();

authRouter.post(
    '/registration',
    upload.single('avatar'),
    authMiddleware.registrationBodyValidate,
    authMiddleware.checkUserIsUniq,
    authController.registration
);

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
