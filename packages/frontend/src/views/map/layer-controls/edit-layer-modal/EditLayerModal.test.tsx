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
import { LayerWrapper } from '../../../../core/geo/layers/LayerWrapper';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';
import { PredefinedLayerModel } from '@abc-map/shared';
import { abcRender } from '../../../../core/utils/test/abcRender';
import EditLayerModal from './EditLayerModal';
import sinon, { SinonStub } from 'sinon';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';

describe('EditLayerModal', () => {
  let onHide: SinonStub;
  let layer: LayerWrapper;

  beforeEach(() => {
    onHide = sinon.stub();
    layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner);
    layer.setName('Layer 1').setOpacity(0.5).setAttributions(['<a href="http://world.company">© World company</a>', 'All rights reserved']);
  });

  it('should change name', () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />);

    // Act
    userEvent.clear(screen.getByTestId('name-input'));
    userEvent.type(screen.getByTestId('name-input'), 'New layer name');
    userEvent.click(screen.getByTestId('submit-button'));

    // Assert
    expect(layer.getName()).toEqual('New layer name');
    expect(onHide.callCount).toEqual(1);
  });

  it('should change opacity', () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />);

    // Act
    fireEvent.change(screen.getByTestId('opacity-input'), { target: { value: 1 } });
    userEvent.click(screen.getByTestId('submit-button'));

    // Assert
    expect(layer.getOpacity()).toEqual(1);
    expect(onHide.callCount).toEqual(1);
  });

  it('should change attributions', () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />);

    // Act
    userEvent.type(screen.getByTestId('attributions-input'), '\nAll lefts too');
    userEvent.click(screen.getByTestId('submit-button'));

    // Assert
    expect(layer.getAttributions()).toEqual(['© World company', 'All rights reserved', 'All lefts too']);
    expect(onHide.callCount).toEqual(1);
  });

  it('should close on cancel', () => {
    // Prepare
    abcRender(<EditLayerModal layer={layer} onHide={onHide} />);

    // Act
    userEvent.click(screen.getByTestId('cancel-button'));

    // Assert
    expect(onHide.callCount).toEqual(1);
  });
});
