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
import { LayerWrapper } from '../../../../core/geo/layers/LayerWrapper';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';
import { PredefinedLayerModel } from '@abc-map/shared';
import { abcRender } from '../../../../core/utils/test/abcRender';
import { EditLayerModal } from './EditLayerModal';
import sinon, { SinonStub } from 'sinon';
import userEvent from '@testing-library/user-event';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { TestServices } from '../../../../core/utils/test/TestServices';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { EditLayerChangeset } from '../../../../core/history/changesets/layers/EditLayerChangeset';
import { MapWrapper } from '../../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../../core/geo/map/MapFactory';
import { mockServices, restoreServices } from '../../../../core/utils/test/mock-services';
import { AttributionFormat } from '../../../../core/geo/AttributionFormat';

describe('EditLayerModal', () => {
  let onHide: SinonStub;
  let layer: LayerWrapper;
  let services: TestServices;
  let map: MapWrapper;

  beforeEach(() => {
    onHide = sinon.stub();
    layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    layer.setName('Layer 1').setOpacity(0.5).setAttributions(['<a href="http://world.company">© World company</a>', 'All rights reserved']);

    map = MapFactory.createNaked();

    services = mockServices();
    services.geo.getMainMap.returns(map);
  });

  afterEach(() => {
    restoreServices();
  });

  it('should change name', async () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />, { services });

    // Act
    await act(async () => {
      await userEvent.clear(screen.getByTestId('name-input'));
      await userEvent.type(screen.getByTestId('name-input'), 'New layer name');
      await userEvent.click(screen.getByTestId('submit-button'));
    });

    // Assert
    await waitFor(() => {
      expect(layer.getName()).toEqual('New layer name');
      expect(onHide.callCount).toEqual(1);
      expect(services.history.register.args).toEqual([
        [
          HistoryKey.Map,
          new EditLayerChangeset(
            map,
            layer,
            {
              attributions: ['<a href="http://world.company">© World company</a>', 'All rights reserved'],
              name: 'Layer 1',
              opacity: 0.5,
            },
            {
              attributions: ['<a href="http://world.company">© World company</a>', 'All rights reserved'],
              name: 'New layer name',
              opacity: 0.5,
            }
          ),
        ],
      ]);
    });
  });

  it('should change opacity', async () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />, { services });

    // Act
    await act(async () => {
      fireEvent.change(screen.getByTestId('opacity-input'), { target: { value: 1 } });
      await userEvent.click(screen.getByTestId('submit-button'));
    });

    // Assert
    await waitFor(() => {
      expect(layer.getOpacity()).toEqual(1);
      expect(onHide.callCount).toEqual(1);
      expect(services.history.register.args).toEqual([
        [
          HistoryKey.Map,
          new EditLayerChangeset(
            map,
            layer,
            {
              attributions: ['<a href="http://world.company">© World company</a>', 'All rights reserved'],
              name: 'Layer 1',
              opacity: 0.5,
            },
            {
              attributions: ['<a href="http://world.company">© World company</a>', 'All rights reserved'],
              name: 'Layer 1',
              opacity: 1,
            }
          ),
        ],
      ]);
    });
  });

  it('should change attributions', async () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />, { services });

    // Act
    await act(async () => {
      await userEvent.type(screen.getByTestId('attributions-input'), '\nAll lefts too');
      await userEvent.click(screen.getByTestId('submit-button'));
    });

    // Assert
    await waitFor(() => {
      expect(layer.getAttributions(AttributionFormat.Text)).toEqual(['© World company', 'All rights reserved', 'All lefts too']);
      expect(onHide.callCount).toEqual(1);
      expect(services.history.register.args).toEqual([
        [
          HistoryKey.Map,
          new EditLayerChangeset(
            map,
            layer,
            {
              attributions: ['<a href="http://world.company">© World company</a>', 'All rights reserved'],
              name: 'Layer 1',
              opacity: 0.5,
            },
            {
              attributions: ['<a href="http://world.company">© World company</a>', 'All rights reserved', 'All lefts too'],
              name: 'Layer 1',
              opacity: 0.5,
            }
          ),
        ],
      ]);
    });
  });

  it('should not register changesets', async () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />, { services });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('submit-button'));
    });

    // Assert
    await waitFor(() => {
      expect(onHide.callCount).toEqual(1);
      expect(services.history.register.callCount).toEqual(0);
    });
  });

  it('should close on cancel', async () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />);

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('cancel-button'));
    });

    // Assert
    expect(onHide.callCount).toEqual(1);
  });
});
