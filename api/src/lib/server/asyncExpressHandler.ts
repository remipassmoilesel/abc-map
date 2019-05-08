import {NextFunction, Request, Response} from 'express-serve-static-core';
import express = require('express');

export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<{}>;

export const asyncHandler = (handler: AsyncRequestHandler) =>
    (request: express.Request, response: express.Response, next: express.NextFunction) => {
        handler(request, response, next)
            .then((result: any) => {
                if (result instanceof Error) {
                    return next(result);
                }
                if (result) {
                    return response.json(result);
                }
                if (!result) {
                    throw new Error('Async handlers must return a result !');
                }
            })
            .catch((err) => {
                return next(err || new Error('Interval server error'));
            });
    };
