import { NextFunction, Response } from 'express';

import { IPaginationQuery, IRequest, IResponse } from '../interfaces';
import { ErrorHandler } from '../errors';
import { errorMessageConstants } from '../constants';
import { HttpMessageEnum, HttpStatusEnum } from '../enums';

class PaginationMiddleware {
    public checkQuery(req: IRequest, _: IResponse<void>, next: NextFunction): void {
        const queryParams = req.query as IPaginationQuery;

        if (queryParams?.page && Number(queryParams.page) > 0) {
            req.pagination = { ...req.pagination, page: queryParams.page };
        }

        if (queryParams?.perPage && Number(queryParams.perPage) > 0) {
            req.pagination = { ...req.pagination, perPage: queryParams.perPage };
        }

        if (queryParams?.sort === 'ASC' || queryParams?.sort === 'DESC') {
            req.sort = queryParams?.sort;
        }

        next();
    }

    public checkParamsId(req: IRequest, _: Response, next: NextFunction): void {
        try {
            const { params } = req;
            const { id } = params;

            if (!id || Number(params.id) <= 0) {
                next(
                    new ErrorHandler(
                        errorMessageConstants.badRequest,
                        HttpStatusEnum.BAD_REQUEST,
                        HttpMessageEnum.BAD_REQUEST
                    )
                );
                return;
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const paginationMiddleware = new PaginationMiddleware();
