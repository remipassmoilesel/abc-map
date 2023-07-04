/**
 * Copyright © 2022 Rémi Pace.
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

import { FastifyRequest } from 'fastify';
import { createHash } from 'crypto';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('hashRequestSource.ts', 'trace');

export function hashRequestSource(req: FastifyRequest, disableWarning = false): string {
  const hasher = createHash('sha256');

  // We look for original client IP address and remove a part of it for privacy purposes
  let forwardedFor = req.headers['x-forwarded-for']?.toString().split('.').slice(1).join('.');
  if (!forwardedFor) {
    !disableWarning && logger.warn(`No "x-forwarded-for" header found for request: ${JSON.stringify(req.headers)}`);
    forwardedFor = '000.000.000.000';
  }

  // We use user agent in order to handle some of multiple clients per IP
  const userAgent = req.headers['user-agent'] || 'no-user-agent';

  return hasher.update(forwardedFor + userAgent).digest('hex');
}
