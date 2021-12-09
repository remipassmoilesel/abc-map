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

import { DEFAULT_PROJECTION, LayerProperties } from '@abc-map/shared';
import Map from 'ol/Map';
import { MapFactory } from './MapFactory';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import { TestHelper } from '../../utils/test/TestHelper';

describe('MapFactory', () => {
  it('createDefault()', () => {
    // Act
    const managed = MapFactory.createDefault();

    // Assert
    const internal = managed.unwrap();
    const layers = internal.getLayers().getArray();
    expect(layers).toHaveLength(2);
    expect(layers[0]).toBeInstanceOf(TileLayer);
    expect(layers[1]).toBeInstanceOf(VectorImageLayer);
    expect(layers[0].get(LayerProperties.Active)).toBeFalsy();
    expect(layers[1].get(LayerProperties.Active)).toBeTruthy();
    expect(internal.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
    expect(getControlNames(internal)).toEqual([]);
    expect(TestHelper.interactionNames(internal)).toEqual(['DragPan', 'KeyboardPan', 'MouseWheelZoom', 'PinchZoom']);
  });

  it('createNaked()', () => {
    const managed = MapFactory.createNaked();
    const internal = managed.unwrap();
    const layers = internal.getLayers().getArray();
    expect(layers).toHaveLength(0);
    expect(internal.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
    expect(getControlNames(internal)).toEqual([]);
  });
});

function getControlNames(map: Map): string[] {
  return map
    .getControls()
    .getArray()
    .map((ctr) => ctr.constructor.name)
    .sort((a, b) => a.localeCompare(b));
}
