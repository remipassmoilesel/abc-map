/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

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
