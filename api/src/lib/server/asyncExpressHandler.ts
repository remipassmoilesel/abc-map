import {RequestHandler} from 'express-serve-static-core';
import express = require('express');

export const asyncHandler = (handler: RequestHandler) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
