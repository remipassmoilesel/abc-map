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
import { newTestServices, TestServices } from '../../../../core/utils/test/TestServices';
import { abcRender } from '../../../../core/utils/test/abcRender';
import EditProjectModal from './EditProjectModal';
import sinon, { SinonStub } from 'sinon';
import { MainState } from '../../../../core/store/reducer';
import { MapWrapper } from '../../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../../core/geo/map/MapFactory';
import { screen, waitFor } from '@testing-library/react';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';
import { PredefinedLayerModel } from '@abc-map/shared';
import userEvent from '@testing-library/user-event';

describe('EditProjectModal', () => {
  let onClose: SinonStub;
  let map: MapWrapper;
  let services: TestServices;

  const baseState: Partial<MainState> = {
    project: {
      metadata: {
        name: 'My awesome project',
      },
      mainView: {
        projection: {
          name: 'EPSG:4326',
        },
      },
      layouts: {
        list: [],
      },
      sharedViews: {
        list: [],
      },
    } as any,
  };

  beforeEach(() => {
    onClose = sinon.stub();
    services = newTestServices();
    map = MapFactory.createNaked();

    services.geo.getMainMap.returns(map);
  });

  it('should render', () => {
    abcRender(<EditProjectModal visible={true} onClose={onClose} />, { services, state: baseState });

    expect(screen.getByTestId('project-name-input')).toHaveValue('My awesome project');
    expect(screen.getByTestId('projection-input')).toHaveValue('EPSG:4326');
    expect(screen.getByTestId('projection-input')).not.toBeDisabled();
  });

  it('should have projection field disabled if layout present', () => {
    // Prepare
    const state = {
      ...baseState,
      project: {
        ...baseState.project,
        layouts: {
          list: [{ id: 'layout-1' }],
          activeId: '',
        },
      },
    } as MainState;

    map.addLayer(LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM));

    // Act
    abcRender(<EditProjectModal visible={true} onClose={onClose} />, { services, state });

    // Assert
    expect(screen.getByTestId('projection-input')).toBeDisabled();
  });

  it('should have projection field disabled if vector layer present', () => {
    map.addLayer(LayerFactory.newVectorLayer());

    abcRender(<EditProjectModal visible={true} onClose={onClose} />, { services, state: baseState });

    expect(screen.getByTestId('projection-input')).toBeDisabled();
  });

  it('should update projection', async () => {
    // Prepare
    services.geo.loadProjection.resolves([-180, -85, 180, 85]);
    abcRender(<EditProjectModal visible={true} onClose={onClose} />, { services, state: baseState });

    // Act
    userEvent.clear(screen.getByTestId('projection-input'));
    userEvent.type(screen.getByTestId('projection-input'), 'EPSG:3857');
    userEvent.click(screen.getByTestId('button-confirm'));

    // Assert
    await waitFor(() => {
      expect(services.geo.loadProjection.args).toEqual([['EPSG:3857']]);
      expect(map.getView().projection).toEqual({ name: 'EPSG:3857' });
      expect(services.project.setView.args).toEqual([
        [
          {
            center: [0, 0],
            projection: {
              name: 'EPSG:3857',
            },
            resolution: 3.6,
          },
        ],
      ]);
      expect(onClose.callCount).toEqual(1);
    });
  });
});
