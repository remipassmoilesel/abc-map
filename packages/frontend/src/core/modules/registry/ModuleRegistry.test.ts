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
import { MainStore, storeFactory } from '../../../core/store/store';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { localModulesFactory } from '../../../modules';
import { UiActions } from '../../store/ui/actions';
import { LocalModuleId } from '../../../modules/LocalModuleId';

describe('ModuleRegistry', () => {
  let services: TestServices;
  let store: MainStore;
  let registry: ModuleRegistry;

  beforeEach(() => {
    services = newTestServices();
    store = storeFactory();
    registry = new ModuleRegistry(services, store, localModulesFactory);
  });

  describe('initialize()', () => {
    let fetchStub: SinonStub;
    beforeEach(() => {
      fetchStub = window.fetch as SinonStub;
    });

    afterEach(() => {
      fetchStub.reset();
    });

    it('should initialize index even if no remote modules', async () => {
      // Prepare
      fetchStub.resolves({ text: () => Promise.resolve(sampleCode()) });

      store.dispatch(UiActions.setRemoteModuleUrls([]));

      await registry.initialize();

      // Act
      const result = registry.search(LocalModuleId.SharedMapSettings);

      // Assert
      expect(result.find((mod) => mod.getId() === LocalModuleId.SharedMapSettings)).toBeDefined();
    });

    it('should initialize index and remote modules', async () => {
      // Prepare
      fetchStub.resolves({ text: () => Promise.resolve(sampleCode()) });

      store.dispatch(UiActions.setRemoteModuleUrls(['http://module-1', 'http://module-2']));

      await registry.initialize();

      // Act
      const result = registry.search('test-module-id');

      // Assert
      expect(fetchStub.args).toEqual([['http://module-1/module.js'], ['http://module-2/module.js']]);
      expect(result.find((mod) => mod.getId() === 'test-module-id')).toBeDefined();
    });
  });

  describe('loadRemoteModule()', () => {
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
      const module = await registry.loadRemoteModule('http://somewhere/abc-map/module');

      // Assert
      expect(fetchStub.args).toEqual([['http://somewhere/abc-map/module/module.js']]);
      expect(module.getId()).toEqual('test-module-id');
    });
  });
});

function sampleCode() {
  return `
          /******/ (() => { // webpackBootstrap
          var moduleFactory = function moduleFactory() {
              return {
                 getId: () => 'test-module-id',
                 getReadableName: () => 'Test module',
                 getShortDescription: () => 'Module used for tests',
                 getFullDescription: () => undefined
              };
          };

          exports.module = {default: moduleFactory};
          /******/ })()
          ;
          //# sourceMappingURL=module.js.map
      `;
}
