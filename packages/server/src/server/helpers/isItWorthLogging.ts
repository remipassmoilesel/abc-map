/**
 * Copyright © 2023 Rémi Pace.
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

const logBlacklist: { userAgent: string; url: string }[] = [
  { userAgent: 'kube-probe/', url: '/api/health' },
  { userAgent: 'Prometheus/', url: '/api/metrics' },
];

export function isItWorthLogging(req: FastifyRequest): boolean {
  const userAgent: string | undefined = req.headers['user-agent'];
  const url: string | undefined = req.url;
  if (!userAgent || !url) {
    return true;
  }

  for (const item of logBlacklist) {
    if (userAgent.startsWith(item.userAgent) && url === item.url) {
      return false;
    }
  }

  return true;
}
