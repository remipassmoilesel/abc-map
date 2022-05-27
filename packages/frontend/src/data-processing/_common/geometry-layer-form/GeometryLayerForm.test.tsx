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
import { TestHelper } from '../../../core/utils/test/TestHelper';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import sinon, { SinonStub } from 'sinon';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { abcRender } from '../../../core/utils/test/abcRender';
import GeometryLayerForm from './GeometryLayerForm';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerFactory } from '../../../core/geo/layers/LayerFactory';

describe('GeometryLayerForm', () => {
  let map: MapWrapper;
  let services: TestServices;
  let handleChanges: SinonStub;

  beforeEach(() => {
    map = MapFactory.createNaked();
    services = newTestServices();
    handleChanges = sinon.stub();

    services.geo.getMainMap.returns(map);
  });

  it('should render', () => {
    abcRender(<GeometryLayerForm values={{ layer: undefined, joinBy: '' }} onChange={handleChanges} />, { services });

    expect(screen.getByText('Layer:')).toBeDefined();
    expect(screen.getByText('Join with data by:')).toBeDefined();
    expect((screen.getByTestId('geometries-join-by') as HTMLSelectElement).value).toEqual('Select a layer');
  });

  it('should notify on layer selection', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);
    abcRender(<GeometryLayerForm values={{ layer: undefined, joinBy: '' }} onChange={handleChanges} />, { services });

    // Act
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');

    // Assert
    await waitFor(() => {
      expect(handleChanges.callCount).toEqual(1);
      expect(handleChanges.args[0]).toEqual([{ layer: layer, joinBy: '' }]);
    });
  });

  it('should notify on join field selection', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);

    // We render then select one layer
    abcRender(<GeometryLayerForm values={{ layer: layer, joinBy: '' }} onChange={handleChanges} />, { services });
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');

    await waitFor(() => screen.getAllByText('Select a join field'));
    handleChanges.reset();

    // Act
    await userEvent.selectOptions(screen.getByTestId('geometries-join-by'), 'CODE');

    // Assert
    await waitFor(() => {
      expect(handleChanges.callCount).toEqual(1);
      expect(handleChanges.args[0]).toEqual([{ layer: layer, joinBy: 'CODE' }]);
    });
  });

  it('should show data samples on selection', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);
    abcRender(<GeometryLayerForm values={{ layer: undefined, joinBy: '' }} onChange={handleChanges} />, { services });

    // Act
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');

    // Assert
    await waitFor(() => {
      const rows = screen.getAllByTestId('data-row') as HTMLTableDataCellElement[];
      expect(rows).toHaveLength(3);
    });
  });

  it('should display message if no geometries found in layer', async () => {
    // Prepare
    const layer = LayerFactory.newVectorLayer();
    layer.setName('Empty layer');
    map.addLayer(layer);
    abcRender(<GeometryLayerForm values={{ layer, joinBy: '' }} onChange={handleChanges} />, { services });

    // Act
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Empty layer');

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/This layer does not contain any geometry/)).toBeDefined();
    });
  });
});
