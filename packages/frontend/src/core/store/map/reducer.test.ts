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

import { mapInitialState, MapState } from './state';
import { MapTool } from '@abc-map/shared';
import { MapActions } from './actions';
import { mapReducer } from './reducer';
import { deepFreeze } from '../../utils/deepFreeze';

describe('Map reducer', function () {
  it('SetTool', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      tool: MapTool.LineString,
    });

    // Act
    const state = mapReducer(initial, MapActions.setTool(MapTool.Point));

    // Assert
    expect(state.tool).toEqual(MapTool.Point);
  });

  it('SetFillColor', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        fill: {
          ...mapInitialState.currentStyle.fill,
          color1: '#000',
        },
      },
    });

    // Act
    const state = mapReducer(initial, MapActions.setFillColor1('#111'));

    // Assert
    expect(state.currentStyle.fill?.color1).toEqual('#111');
  });

  it('SetStrokeColor', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        stroke: {
          ...mapInitialState.currentStyle.stroke,
          color: '#000',
        },
      },
    });

    // Act
    const state = mapReducer(initial, MapActions.setStrokeColor('#111'));

    // Assert
    expect(state.currentStyle.stroke?.color).toEqual('#111');
  });

  it('SetStrokeWidth', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        stroke: {
          ...mapInitialState.currentStyle.stroke,
          width: 5,
        },
      },
    });

    // Act
    const state = mapReducer(initial, MapActions.setStrokeWidth(10));

    // Assert
    expect(state.currentStyle.stroke?.width).toEqual(10);
  });

  it('SetTextOffsetX', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        text: {
          ...mapInitialState.currentStyle.text,
          offsetX: 5,
        },
      },
    });

    // Act
    const state = mapReducer(initial, MapActions.setTextOffsetX(10));

    // Assert
    expect(state.currentStyle.text?.offsetX).toEqual(10);
  });

  it('SetTextOffsetY', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        text: {
          ...mapInitialState.currentStyle.text,
          offsetY: 5,
        },
      },
    });

    // Act
    const state = mapReducer(initial, MapActions.setTextOffsetY(10));

    // Assert
    expect(state.currentStyle.text?.offsetY).toEqual(10);
  });

  it('SetTextRotation', function () {
    // Prepare
    const initial: MapState = deepFreeze({
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        text: {
          ...mapInitialState.currentStyle.text,
          rotation: 5,
        },
      },
    });

    // Act
    const state = mapReducer(initial, MapActions.setTextRotation(10));

    // Assert
    expect(state.currentStyle.text?.rotation).toEqual(10);
  });
});
