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
import { FastifySchema } from 'fastify/types/schema';
import { MultipartFile, MultipartValue } from '@fastify/multipart';

export interface SaveRequest {
  metadata: MultipartValue<string>;
  project: MultipartFile;
}

export interface ByIdParams {
  projectId: string;
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

export const ByIdSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['projectId'],
    additionalProperties: false,
    properties: {
      projectId: { type: 'string' },
    },
  },
};
