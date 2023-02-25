import { Router } from 'express';
import { commentsController } from '../controllers';
import { authMiddleware, commentMiddleware, paginationMiddleware, textPhotoFields } from '../middlewares';
import { filesUploadFields } from '../constants';

export const commentsRouter = Router();

const filesUpload = textPhotoFields();

commentsRouter.get('/', commentsController.getAll);

commentsRouter.post(
    '/',
    filesUpload.fields(filesUploadFields),
    authMiddleware.authorization,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyAccessToken,
    commentMiddleware.validateBody,
    commentMiddleware.cheUser,
    commentMiddleware.checkMainCommentExistsById,
    authMiddleware.wasItIssuedToken,
    authMiddleware.checkUserAuthByPayload,
    commentsController.createOne
);

commentsRouter.delete(
    '/:id',
    paginationMiddleware.checkParamsId,
    authMiddleware.authorization,
    authMiddleware.isClientKey,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyAccessToken,
    authMiddleware.wasItIssuedToken,
    commentMiddleware.checkCommentExistsById,
    commentMiddleware.checkUserIsdAuthor,
    commentsController.deleteById
);
