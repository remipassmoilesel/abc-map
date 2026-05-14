/**
 * Copyright © 2026 Rémi Pace.
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

import { ModuleRegistry } from './ModuleRegistry';
import type { MainStore } from '../../../store/store';
import { storeFactory } from '../../../store/store';
import type { TestServices } from '../../../core/utils/test/TestServices';
import { newTestServices } from '../../../core/utils/test/TestServices';
import { bundledModulesFactory } from '../../../modules';
import { ModuleId } from '@abc-map/shared';
import { disableSearchIndexLogging } from '../../utils/SearchIndex';
import { beforeEach, describe, expect, it } from 'vitest';

disableSearchIndexLogging();

describe('ModuleRegistry', () => {
  let services: TestServices;
  let store: MainStore;
  let registry: ModuleRegistry;

  beforeEach(() => {
    services = newTestServices();
    store = storeFactory();
    registry = new ModuleRegistry(services, store, bundledModulesFactory);
  });

  describe('initialize()', () => {
    it('should initialize index', async () => {
      // Prepare
      await registry.initialize();

      // Act
      const result = registry.search(ModuleId.SharedMapSettings);

      // Assert
      expect(result.find((mod) => mod.getId() === ModuleId.SharedMapSettings)).toBeDefined();
    });
  });
});
