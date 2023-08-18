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

import { assert } from 'chai';
import { FastifyRequest } from 'fastify';
import { isItWorthLogging } from './isItWorthLogging';

describe('isItWorthLogging()', () => {
  it('should work', () => {
    assert.isTrue(isItWorthLogging(fakeRequest()));
    assert.isTrue(isItWorthLogging(fakeRequest({ url: '/', headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })));
    assert.isTrue(isItWorthLogging(fakeRequest({ url: '/api/authentication', headers: { 'user-agent': 'Go-http-client/1.0' } })));

    assert.isFalse(isItWorthLogging(fakeRequest({ url: '/api/health', headers: { 'user-agent': 'kube-probe/1.0' } })));
    assert.isFalse(isItWorthLogging(fakeRequest({ url: '/api/health', headers: { 'user-agent': 'kube-probe/1.21' } })));
  });

  function fakeRequest(source?: Partial<FastifyRequest>): FastifyRequest {
    return { ...source, headers: { ...source?.headers } } as unknown as FastifyRequest;
  }
});
