/**
 * Copyright © 2023 Rémi Pace.
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

import { EditableLayerProperties, EditLayerChangeset } from './EditLayerChangeset';
import sinon, { SinonStubbedInstance } from 'sinon';
import { LayerWrapper } from '../../../geo/layers/LayerWrapper';
import { MapWrapper } from '../../../geo/map/MapWrapper';

describe('EditLayerChangeset', () => {
  let map: SinonStubbedInstance<MapWrapper>;
  let layer: SinonStubbedInstance<LayerWrapper>;
  let before: EditableLayerProperties;
  let after: EditableLayerProperties;
  let changeset: EditLayerChangeset;

  beforeEach(() => {
    map = sinon.createStubInstance(MapWrapper);
    layer = sinon.createStubInstance(LayerWrapper);
    layer.setName.returns(layer as unknown as LayerWrapper);
    layer.setOpacity.returns(layer as unknown as LayerWrapper);
    layer.setAttributions.returns(layer as unknown as LayerWrapper);

    before = {
      name: 'Before layer',
      opacity: 1,
      attributions: ['Before attribution 1'],
    };
    after = {
      name: 'After layer',
      opacity: 1,
      attributions: ['After attribution 1'],
    };

    changeset = new EditLayerChangeset(map as unknown as MapWrapper, layer as unknown as LayerWrapper, before, after);
  });

  it('undo()', async () => {
    await changeset.undo();

    expect(map.triggerLayerChange.callCount).toEqual(1);
    expect(layer.setName.args).toEqual([['Before layer']]);
    expect(layer.setOpacity.args).toEqual([[1]]);
    expect(layer.setAttributions.args).toEqual([[['Before attribution 1']]]);
  });

  it('redo()', async () => {
    await changeset.execute();

    expect(map.triggerLayerChange.callCount).toEqual(1);
    expect(layer.setName.args).toEqual([['After layer']]);
    expect(layer.setOpacity.args).toEqual([[1]]);
    expect(layer.setAttributions.args).toEqual([[['After attribution 1']]]);
  });
});
