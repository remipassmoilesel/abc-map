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

import { logger, parseError, Scripts } from './Scripts';
import { ChromiumStack, FirefoxStack } from './Script.test.data';
import sinon, { SinonStubbedInstance } from 'sinon';
import { GeoService } from '../../core/geo/GeoService';
import { ScriptError } from './typings';

logger.disable();

describe('ScriptsModule', function () {
  describe('process()', () => {
    let geoStub: SinonStubbedInstance<GeoService>;
    let scripts: Scripts;

    beforeEach(() => {
      geoStub = sinon.createStubInstance(GeoService);
      scripts = new Scripts();
    });

    it('should work', async () => {
      geoStub.getMainMap.returns({} as any);
      const script = `
         const {mainMap} = moduleApi;
         log('Hello')
         log('World')
         log(mainMap)
      `;

      const result = await scripts.process(script);
      expect(result).toEqual(['Hello', 'World', '[object Object]']);
    });

    it('should return correct error', async () => {
      geoStub.getMainMap.returns({} as any);
      const script = `\
         const {mainMap} = moduleApi;
         log('Hello')
         log('World')
         log(mainMap)
         throw new Error('Test error')
      `;

      const error: ScriptError = await scripts.process(script).catch((err) => err);
      expect(error.message).toMatch(/Error line [0-9], column [0-9]{2}. Message: Test error/); // Position is not correct, but is in browser
      expect(error.output).toEqual(['Hello', 'World', '[object Object]']);
    });
  });

  describe('parseError()', () => {
    it('should parse a Firefox error stack', () => {
      expect(parseError({ stack: FirefoxStack })).toEqual({ line: 1, column: 7 });
    });

    it('should parse a Chromium error stack', () => {
      expect(parseError({ stack: ChromiumStack })).toEqual({ line: 1, column: 7 });
    });
  });
});
