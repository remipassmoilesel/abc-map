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

import { newTestServices, TestServices } from '../../../../../core/utils/test/TestServices';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { abcRender } from '../../../../../core/utils/test/abcRender';
import TextFormat from './TextFormat';
import { Point } from 'ol/geom';
import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { MainStore, storeFactory } from '../../../../../core/store/store';
import { TestHelper } from '../../../../../core/utils/test/TestHelper';

describe('TextFormat', () => {
  let services: TestServices;
  let store: MainStore;
  let feature: FeatureWrapper;

  beforeEach(() => {
    services = newTestServices();
    store = storeFactory();
    feature = FeatureWrapper.create(new Point([1, 1]));
  });

  it('should set size', async () => {
    // Prepare
    abcRender(<TextFormat />, { services, store });

    // Act
    await act(async () => {
      await userEvent.type(screen.getByTestId('text-size'), '5');
    });
    await TestHelper.wait(250); // We must wait for debounce
    callTransform();

    // Assert
    expect(store.getState().map.currentStyle.text.size).toEqual(155);
    expect(feature.getStyleProperties().text?.size).toEqual(155);
  });

  it('should set offsetX', async () => {
    // Prepare
    abcRender(<TextFormat />, { services, store });

    // Act
    await act(async () => {
      await userEvent.type(screen.getByTestId('text-offsetX'), '9');
    });

    await TestHelper.wait(250); // We must wait for debounce
    callTransform();

    // Assert
    expect(store.getState().map.currentStyle.text.offsetX).toEqual(209);
    expect(feature.getStyleProperties().text?.offsetX).toEqual(209);
  });

  it('should set offsetY', async () => {
    // Prepare
    abcRender(<TextFormat />, { services, store });

    // Act
    await act(async () => {
      await userEvent.type(screen.getByTestId('text-offsetY'), '9');
    });

    await TestHelper.wait(250); // We must wait for debounce
    callTransform();

    // Assert
    expect(store.getState().map.currentStyle.text.offsetY).toEqual(209);
    expect(feature.getStyleProperties().text?.offsetY).toEqual(209);
  });

  it('should set rotation', async () => {
    // Prepare
    abcRender(<TextFormat />, { services, store });

    // Act
    await act(async () => {
      await userEvent.type(screen.getByTestId('text-rotation'), '9');
    });

    await TestHelper.wait(250); // We must wait for debounce
    callTransform();

    // Assert
    expect(store.getState().map.currentStyle.text.rotation).toEqual(9);
    expect(feature.getStyleProperties().text?.rotation).toEqual(9);
  });

  function callTransform() {
    const style = services.geo.updateSelectedFeatures.args[0][0](feature.getStyleProperties(), feature);
    if (style) {
      feature.setStyleProperties(style);
    }
  }
});
