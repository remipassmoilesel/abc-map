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

import React from 'react';
import { logger, MainMap } from './MainMap';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';

logger.disable();

describe('MainMap', () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
  });

  describe('Initialization', () => {
    it('should initialize map correctly', () => {
      const map = MapFactory.createNaked();
      const internal = map.unwrap();

      expect(internal.getTarget()).toBeUndefined();

      act(() => {
        renderMap(map, container);
      });

      expect(internal.getTarget()).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Cleanup', () => {
    it('should remove target', () => {
      const map = MapFactory.createNaked();
      const internal = map.unwrap();
      const vector = LayerFactory.newVectorLayer();
      map.addLayer(vector);
      map.setActiveLayer(vector);

      act(() => {
        renderMap(map, container);
      });

      act(() => {
        unmountComponentAtNode(container);
      });

      expect(internal.getTarget()).toBeUndefined();
    });
  });
});

/**
 * Render map with specified parameters then return a reference to component.
 *
 */
function renderMap(map: MapWrapper, container: HTMLElement): MainMap {
  // Note: ReactDOM.render() function signature is broken
  return ReactDOM.render(<MainMap map={map} services={{} as any} />, container) as any;
}
