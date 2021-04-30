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
import { MapTool } from '@abc-map/frontend-commons';
import { MapActions } from './actions';
import { mapReducer } from './reducer';

describe('Map reducer', function () {
  it('SetTool', function () {
    const initial: MapState = {
      ...mapInitialState,
      tool: MapTool.LineString,
    };
    const snapshot = JSON.stringify(initial);

    const action = MapActions.setTool(MapTool.LineString);
    const state = mapReducer(initial, action);

    expect(JSON.stringify(initial)).toEqual(snapshot);
    expect(state.tool).toEqual(MapTool.LineString);
  });

  it('SetFillColor', function () {
    const initial: MapState = {
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        fill: {
          ...mapInitialState.currentStyle.fill,
          color1: '#000',
        },
      },
    };
    const snapshot = JSON.stringify(initial);

    const action = MapActions.setFillColor1('#111');
    const state = mapReducer(initial, action);

    expect(JSON.stringify(initial)).toEqual(snapshot);
    expect(state.currentStyle.fill?.color1).toEqual('#111');
  });

  it('SetStrokeColor', function () {
    const initial: MapState = {
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        stroke: {
          ...mapInitialState.currentStyle.stroke,
          color: '#000',
        },
      },
    };
    const snapshot = JSON.stringify(initial);

    const action = MapActions.setStrokeColor('#111');
    const state = mapReducer(initial, action);

    expect(JSON.stringify(initial)).toEqual(snapshot);
    expect(state.currentStyle.stroke?.color).toEqual('#111');
  });

  it('SetStrokeWidth', function () {
    const initialState: MapState = {
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        stroke: {
          ...mapInitialState.currentStyle.stroke,
          width: 5,
        },
      },
    };
    const snapshot = JSON.stringify(initialState);

    const action = MapActions.setStrokeWidth(10);
    const state = mapReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.currentStyle.stroke?.width).toEqual(10);
  });
});
