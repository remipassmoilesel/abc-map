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

import React from 'react';
import MainMap, { disableMainMapLogs } from './MainMap';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import type { TestServices } from '../../../core/utils/test/TestServices';
import { newTestServices } from '../../../core/utils/test/TestServices';
import { abcRender } from '../../../core/utils/test/abcRender';
import { beforeEach, describe, expect, it } from 'vitest';

disableMainMapLogs();

describe('MainMap', () => {
  let services: TestServices;

  beforeEach(() => {
    services = newTestServices();
  });

  describe('Initialization', () => {
    it('should initialize map correctly', () => {
      // Prepare
      const map = MapFactory.createNaked();
      const internal = map.unwrap();
      expect(internal.getTarget()).toBeUndefined();
      services.geo.getMainMap.returns(map);

      // Act
      abcRender(<MainMap />, { services });

      // Assert
      expect(internal.getTarget()).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Cleanup', () => {
    it('should remove target', () => {
      // Prepare
      const map = MapFactory.createNaked();
      const internal = map.unwrap();
      const vector = LayerFactory.newVectorLayer();
      map.addLayer(vector);
      map.setActiveLayer(vector);
      services.geo.getMainMap.returns(map);

      // Act
      const { unmount } = abcRender(<MainMap />, { services });
      unmount();

      // Assert
      expect(internal.getTarget()).toBeUndefined();
    });
  });
});
