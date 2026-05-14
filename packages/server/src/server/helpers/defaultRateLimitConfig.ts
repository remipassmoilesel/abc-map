/**
 * Copyright © 2026 Rémi Pace.
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

import type { Config } from '../../config/Config.js';
import type { FastifyRequest } from 'fastify';
import { hashRequestSource } from './hashRequestSource.js';

export function defaultRateLimitConfig(config: Config) {
  return {
    max: config.server.globalRateLimit.max,
    timeWindow: config.server.globalRateLimit.timeWindow,
    keyGenerator: (req: FastifyRequest) => {
      // We do not display warnings here because we do not check presence of source IP address
      return hashRequestSource(req, false);
    },
  };
}
