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

import { SinonStub } from 'sinon';
import { ModuleRegistry } from './ModuleRegistry';
import { MainStore, storeFactory } from '../core/store/store';

describe('ModuleRegistry', () => {
  let store: MainStore;
  let registry: ModuleRegistry;

  beforeEach(() => {
    store = storeFactory();
    registry = new ModuleRegistry(store);
  });

  describe('load()', () => {
    let fetchStub: SinonStub;
    beforeEach(() => {
      fetchStub = window.fetch as SinonStub;
    });

    afterEach(() => {
      fetchStub.reset();
    });

    it('should load remote module', async () => {
      // Prepare
      fetchStub.resolves({ text: () => Promise.resolve(sampleCode()) });

      // Act
      const module = await registry.load('http://somewhere/abc-map/module');

      // Assert
      expect(fetchStub.args).toEqual([['http://somewhere/abc-map/module/module.js']]);
      expect(module.getId()).toEqual('test-module-id');
    });

    function sampleCode() {
      return `/******/ (() => { // webpackBootstrap
          var moduleFactory = function moduleFactory() {
              return { getId: () => 'test-module-id' };
          };
          exports.module = {default: moduleFactory};
          /******/ })()
          ;
          //# sourceMappingURL=module.js.map`;
    }
  });
});
