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
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { PredefinedLayerModel } from '@abc-map/shared';
import { ScriptMap } from './ScriptMap';

describe('ScriptMap', function () {
  let map: MapWrapper;
  let scriptMap: ScriptMap;
  beforeEach(() => {
    map = MapFactory.createNaked();
    scriptMap = new ScriptMap(map);
  });

  it('listLayers()', () => {
    const vector = LayerFactory.newVectorLayer();
    const predefined = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    map.addLayer(vector);
    map.addLayer(predefined);

    expect(
      scriptMap
        .listLayers()
        .map((lay) => lay.id)
        .sort()
    ).toEqual([vector.getId(), predefined.getId()].sort());
  });

  it('findByName()', () => {
    const vector = LayerFactory.newVectorLayer();
    vector.setName('Vector layer 1');
    const predefined = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    map.addLayer(vector);
    map.addLayer(predefined);

    expect(scriptMap.findByName('Vector layer 1')?.id).toEqual(vector.getId());
    expect(scriptMap.findByName('Vector layer 2')).toBeUndefined();
  });

  it('findById()', () => {
    const vector = LayerFactory.newVectorLayer();
    const predefined = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    map.addLayer(vector);
    map.addLayer(predefined);

    expect(vector.getId()).toBeDefined();
    expect(scriptMap.findById(vector.getId() as string)?.id).toEqual(vector.getId());
    expect(scriptMap.findById('not an id')).toBeUndefined();
  });
});
