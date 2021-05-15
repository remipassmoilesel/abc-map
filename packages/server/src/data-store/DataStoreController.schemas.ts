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
import { FastifySchema } from 'fastify/types/schema';
import { PaginatedQuery } from '../server/PaginationHelper';

export interface SearchQuery extends PaginatedQuery {
  query: string;
}

export interface ByIdParams {
  artefactId: string;
}

export const ListSchema: FastifySchema = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      limit: { type: 'string' },
      offset: { type: 'string' },
    },
  },
};

export const SearchSchema: FastifySchema = {
  querystring: {
    type: 'object',
    required: ['query'],
    additionalProperties: false,
    properties: {
      limit: { type: 'string' },
      offset: { type: 'string' },
      query: { type: 'string' },
    },
  },
};

export const GetByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['artefactId'],
    additionalProperties: false,
    properties: {
      artefactId: { type: 'string' },
    },
  },
};
