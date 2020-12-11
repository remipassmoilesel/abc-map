import * as express from 'express';
import { Logger } from '../utils/Logger';

const logger = Logger.get('asyncHandler.ts');

export type AsyncHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>;

export function asyncHandler(handler: AsyncHandler) {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    handler(req, res, next)
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        }
      })
      .catch((err: Error | undefined) => {
        logger.error('Async HTTP handler error: ', err);
        const message = err?.message || 'Unknwon error';
        const stack = err?.stack || new Error().stack;
        res.status(500).json({
          error: {
            message,
            stack,
          },
        });
      });
  };
}
