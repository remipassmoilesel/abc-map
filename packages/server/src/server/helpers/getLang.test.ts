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

import { getLang } from './getLang';
import { FastifyRequest } from 'fastify';
import { assert } from 'chai';
import { FallbackLang, Language } from '@abc-map/shared';

describe('getLang()', () => {
  it('should return EN', () => {
    const req = fakeReq('en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7');

    const lang = getLang(req);

    assert.equal(lang, Language.English);
  });

  it('should return FR', () => {
    const req = fakeReq('fr-FR,fr;q=0.9,en-EN;q=0.8,fr;q=0.7');

    const lang = getLang(req);

    assert.equal(lang, Language.French);
  });

  it('should return fallback', () => {
    const req = fakeReq('ru-RU,ru;');

    const lang = getLang(req);

    assert.equal(lang, FallbackLang);
  });

  it('should return fallback', () => {
    const req = fakeReq('');

    const lang = getLang(req);

    assert.equal(lang, FallbackLang);
  });

  function fakeReq(acceptHeader: string): FastifyRequest {
    return { headers: { 'accept-language': acceptHeader } } as unknown as FastifyRequest;
  }
});
