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

import { MapWrapper } from '../../../geo/map/MapWrapper';
import { MapFactory } from '../../../geo/map/MapFactory';
import { AddLayersChangeset } from './AddLayersChangeset';
import { LayerFactory } from '../../../geo/layers/LayerFactory';

describe('AddLayersChangeset', () => {
  let map: MapWrapper;

  beforeEach(() => {
    map = MapFactory.createNaked();
  });

  it('undo()', async () => {
    const layer1 = LayerFactory.newVectorLayer();
    const layer2 = LayerFactory.newVectorLayer();
    map.addLayer(layer1);
    map.addLayer(layer2);

    const changeset = new AddLayersChangeset(map, [layer1, layer2]);
    await changeset.undo();

    expect(map.getLayers()).toHaveLength(0);
  });

  it('redo()', async () => {
    const layer1 = LayerFactory.newVectorLayer();
    const layer2 = LayerFactory.newVectorLayer();

    const changeset = new AddLayersChangeset(map, [layer1, layer2]);
    await changeset.apply();

    expect(map.getLayers()).toHaveLength(2);
    expect(map.getLayers()[1].isActive()).toEqual(true);
  });
});
