import { FastifySchema } from 'fastify/types/schema';
import { VoteValue } from '@abc-map/shared';

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

export interface StatParams {
  from: string;
  to: string;
}

export const VoteSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['value'],
    additionalProperties: false,
    properties: {
      value: { type: 'number', enum: [VoteValue.NOT_SATISFIED, VoteValue.BLAH, VoteValue.SATISFIED] },
    },
  },
};

export const TextFeedbackSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['text', 'lang'],
    additionalProperties: false,
    properties: {
      text: { type: 'string' },
      lang: { type: 'string' },
    },
  },
};
