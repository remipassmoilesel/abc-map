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

import { assert } from 'chai';
import { hashRequestSource } from './hashRequestSource';
import { FastifyRequest } from 'fastify';

describe('hashRequestSource()', () => {
  const req1 = fakeRequest();
  assert.deepEqual(hashRequestSource(req1, true), '8f9b9ec54448559a741751de7057c1e368e19a1b9cf8a4496be48b3ce93751ab');

  const req2 = fakeRequest({ headers: { 'x-forwarded-for': '90.90.90.90' } });
  assert.deepEqual(hashRequestSource(req2), 'ff05e2ffcb03cfea04d594778ef2e19ca6657f7d5856f9ee7d947ddf835bce5e');

  const req3 = fakeRequest({ headers: { 'x-forwarded-for': '90.90.90.90', 'user-agent': 'Mozilla/5.0 Firefox/5.0.1' } });
  assert.deepEqual(hashRequestSource(req3), '450f862a2f253aee6ff4679dcea399eb3ad1566033cc0bd42d491e29ae613b2f');
});

function fakeRequest(source?: Partial<FastifyRequest>): FastifyRequest {
  return { ...source, headers: { ...source?.headers } } as unknown as FastifyRequest;
}
