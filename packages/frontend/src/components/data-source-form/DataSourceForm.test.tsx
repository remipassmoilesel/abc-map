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
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { newTestServices, TestServices } from '../../core/utils/test/TestServices';
import sinon, { SinonStub } from 'sinon';
import { MapFactory } from '../../core/geo/map/MapFactory';
import { abcRender } from '../../core/utils/test/abcRender';
import { screen, waitFor } from '@testing-library/react';
import DataSourceForm from './DataSourceForm';
import { TestHelper } from '../../core/utils/test/TestHelper';
import userEvent from '@testing-library/user-event';
import { LayerDataSource } from '../../core/data/data-source/LayerDataSource';

describe('DataSourceForm', () => {
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
    abcRender(
      <DataSourceForm
        valuesFieldLabel={'Values field'}
        valuesFieldTip={'tip-id'}
        values={{ source: undefined, valueField: '', joinBy: '' }}
        onChange={handleChanges}
      />,
      { services }
    );

    expect(screen.getByText(/Values field/)).toBeDefined();
    expect(screen.getByText(/Join with geometries by/)).toBeDefined();
    expect((screen.getByTestId('value-field') as HTMLSelectElement).value).toEqual('Select a data source');
    expect((screen.getByTestId('data-join-by') as HTMLSelectElement).value).toEqual('Select a data source');
  });

  it('should render', () => {
    abcRender(
      <DataSourceForm
        valuesFieldLabel={'Values field'}
        valuesFieldTip={'tip-id'}
        values={{ source: undefined, valueField: '', joinBy: '' }}
        onChange={handleChanges}
      />,
      { services }
    );

    expect(screen.getByText(/Select a layer/)).toBeDefined();
    expect(screen.getByText(/Use a CSV workbook/)).toBeDefined();
    expect(screen.getByText(/Values field/)).toBeDefined();
    expect(screen.getByText(/Join with geometries by/)).toBeDefined();
    expect((screen.getByTestId('value-field') as HTMLSelectElement).value).toEqual('Select a data source');
    expect((screen.getByTestId('data-join-by') as HTMLSelectElement).value).toEqual('Select a data source');
  });

  it('should notify on layer selected', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);

    abcRender(
      <DataSourceForm
        valuesFieldLabel={'Values field'}
        valuesFieldTip={'tip-id'}
        values={{ source: undefined, valueField: '', joinBy: '' }}
        onChange={handleChanges}
      />,
      { services }
    );

    // Act
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');

    // Assert
    await waitFor(() => {
      expect(handleChanges.callCount).toEqual(1);
      expect(handleChanges.args[0]).toEqual([{ source: new LayerDataSource(layer), valueField: '', joinBy: '' }]);
    });
  });

  it('should notify on value field selected', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);

    // We select a layer then wait for loading
    abcRender(
      <DataSourceForm
        valuesFieldLabel={'Values field'}
        valuesFieldTip={'tip-id'}
        values={{ source: new LayerDataSource(layer), valueField: '', joinBy: '' }}
        onChange={handleChanges}
      />,
      { services }
    );
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');
    await waitFor(() => screen.getAllByText(/Select a field/));
    handleChanges.reset();

    // Act
    await userEvent.selectOptions(screen.getByTestId('value-field'), 'POP');

    // Assert
    await waitFor(() => {
      expect(handleChanges.callCount).toEqual(1);
      expect(handleChanges.args[0]).toEqual([{ source: new LayerDataSource(layer), valueField: 'POP', joinBy: '' }]);
    });
  });

  it('should notify on join-by field selected', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);

    // We select a layer, a value field then wait for loading
    abcRender(
      <DataSourceForm
        valuesFieldLabel={'Values field'}
        valuesFieldTip={'tip-id'}
        values={{ source: new LayerDataSource(layer), valueField: 'POP', joinBy: '' }}
        onChange={handleChanges}
      />,
      { services }
    );
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');
    await waitFor(() => screen.getAllByText(/Select a field/));
    handleChanges.reset();

    // Act
    await userEvent.selectOptions(screen.getByTestId('data-join-by'), 'CODE');

    // Assert
    await waitFor(() => {
      expect(handleChanges.callCount).toEqual(1);
      expect(handleChanges.args[0]).toEqual([{ source: new LayerDataSource(layer), valueField: 'POP', joinBy: 'CODE' }]);
    });
  });

  it('should show data sample on layer selection', async () => {
    // Prepare
    const layer = TestHelper.regionsOfFranceVectorLayer();
    map.addLayer(layer);

    abcRender(
      <DataSourceForm
        valuesFieldLabel={'Values field'}
        valuesFieldTip={'tip-id'}
        values={{ source: new LayerDataSource(layer), valueField: 'POP', joinBy: '' }}
        onChange={handleChanges}
      />,
      { services }
    );

    // Act
    await userEvent.selectOptions(screen.getByTestId('vector-layer-selector'), 'Regions of France');

    // Assert
    await waitFor(() => {
      const rows = screen.getAllByTestId('data-row') as HTMLTableDataCellElement[];
      expect(rows).toHaveLength(3);
    });
  });
});
