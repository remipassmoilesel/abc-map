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

import { FastifyRequest } from 'fastify';

export interface PaginatedQuery {
  limit?: string;
  offset?: string;
}

export class PaginationHelper {
  public static fromQuery(req: FastifyRequest<{ Querystring: PaginatedQuery }>): { limit: number; offset: number } {
    const limit = parseInt(req.query.limit || '10');
    const offset = parseInt(req.query.offset || '0');
    return { limit, offset };
  }
}
