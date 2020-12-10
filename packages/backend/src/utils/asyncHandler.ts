import * as express from 'express';
import { Logger } from './Logger';

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
      .catch((err) => res.status(500).json({ error: err }));
  };
}
