import { logger, parseError, Scripts } from './Scripts';
import { ChromiumStack, FirefoxStack } from './Script.test.data';
import sinon, { SinonStubbedInstance } from 'sinon';
import { GeoService } from '../../core/geo/GeoService';
import { Services } from '../../core/Services';
import { ScriptError } from './typings';

logger.disable();

describe('Scripts', function () {
  describe('process()', () => {
    let geoStub: SinonStubbedInstance<GeoService>;
    let scripts: Scripts;

    beforeEach(() => {
      geoStub = sinon.createStubInstance(GeoService);
      const services = ({ geo: geoStub } as unknown) as Services;
      scripts = new Scripts(services);
    });

    it('should work', async () => {
      geoStub.getMainMap.returns({} as any);
      const script = `
         log('Hello')
         log('World')
         log(map)
      `;

      const result = await scripts.process(script);
      expect(result).toEqual(['Hello', 'World', '[object Object]']);
    });

    it('should return correct error', async () => {
      geoStub.getMainMap.returns({} as any);
      const script = `\
         log('Hello')
         log('World')
         log(map)
         throw new Error('Test error')
      `;

      const error: ScriptError = await scripts.process(script).catch((err) => err);
      expect(error.message).toMatch(/Error line [0-9], column [0-9]{2}. Message: Test error/); // Position is not correct, but is in browser
      expect(error.output).toEqual(['Hello', 'World', '[object Object]']);
    });

    it('should parse a Chromium error stack', () => {
      expect(parseError({ stack: ChromiumStack })).toEqual({ line: 1, column: 7 });
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
