import * as express from 'express';
import { Logger } from '../utils/Logger';

const logger = Logger.get('asyncHandler.ts');

export type AsyncHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;

/**
 * Wrap an express handler, and allow to return responses as promise, or to catch awaited promises.
 *
 * - Handlers must return something
 * - Response will be a json response
 *
 * @param handler
 */
export function asyncHandler(handler: AsyncHandler) {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    handler(req, res, next).catch((err: Error | undefined) => {
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
