import { Router } from 'express';

import { mainCommentsController } from '../controllers';
import { authMiddleware, mainCommentMiddlewares, paginationMiddleware, textPhotoFields } from '../middlewares';
import { filesUploadFields } from '../constants';

export const mainCommentsRouter = Router();

const filesUpload = textPhotoFields();

mainCommentsRouter.get('/', paginationMiddleware.checkQuery, mainCommentsController.getAllWithPagination);

mainCommentsRouter.get('/userName', paginationMiddleware.checkQuery, mainCommentsController.getAllOfUserNameWithPagination);

mainCommentsRouter.get('/userEmail', paginationMiddleware.checkQuery, mainCommentsController.getAllOfUserEmailWithPagination);

mainCommentsRouter.get('/:id', paginationMiddleware.checkParamsId, mainCommentsController.getOneById);

mainCommentsRouter.post(
    '/',
    filesUpload.fields(filesUploadFields),
    authMiddleware.authorization,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyAccessToken,
    mainCommentMiddlewares.validateBody,
    authMiddleware.wasItIssuedToken,
    authMiddleware.checkUserAuthByPayload,
    mainCommentsController.createOne
);

mainCommentsRouter.patch(
    '/:id',
    filesUpload.fields(filesUploadFields),
    authMiddleware.authorization,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyAccessToken,
    mainCommentMiddlewares.validateBody,
    authMiddleware.wasItIssuedToken,
    authMiddleware.checkUserAuthByPayload,
    mainCommentMiddlewares.checkMainCommentExistsById,
    mainCommentMiddlewares.checkUseridAndAuthorId,
    mainCommentsController.updateOne
);

mainCommentsRouter.delete(
    '/:id',
    paginationMiddleware.checkParamsId,
    authMiddleware.isClientKey,
    authMiddleware.authorization,
    authMiddleware.checkAuthorizationOnBearer,
    authMiddleware.validateAuthorizationToken,
    authMiddleware.verifyAccessToken,
    authMiddleware.wasItIssuedToken,
    mainCommentMiddlewares.checkMainCommentExistsById,
    mainCommentMiddlewares.checkUseridAndAuthorId,
    mainCommentsController.deleteOne
);
