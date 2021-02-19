import { mapInitialState, MapState } from './state';
import { MapTool } from '@abc-map/shared-entities';
import { MapActions } from './actions';
import { mapReducer } from './reducer';

describe('Map reducer', function () {
  it('SetTool', function () {
    const initialState: MapState = {
      ...mapInitialState,
      tool: MapTool.Circle,
    };
    const snapshot = JSON.stringify(initialState);

    const action = MapActions.setTool(MapTool.LineString);
    const state = mapReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.tool).toEqual(MapTool.LineString);
  });

  it('SetFillColor', function () {
    const initialState: MapState = {
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        fill: {
          ...mapInitialState.currentStyle.fill,
        },
      },
    };
    initialState.currentStyle.fill.color1 = '#000';
    const snapshot = JSON.stringify(initialState);

    const action = MapActions.setFillColor1('#111');
    const state = mapReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.currentStyle.fill.color1).toEqual('#111');
  });

  it('SetStrokeColor', function () {
    const initialState: MapState = {
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        stroke: {
          ...mapInitialState.currentStyle.stroke,
        },
      },
    };
    initialState.currentStyle.stroke.color = '#000';
    const snapshot = JSON.stringify(initialState);

    const action = MapActions.setStrokeColor('#111');
    const state = mapReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.currentStyle.stroke.color).toEqual('#111');
  });

  it('SetStrokeWidth', function () {
    const initialState: MapState = {
      ...mapInitialState,
      currentStyle: {
        ...mapInitialState.currentStyle,
        stroke: {
          ...mapInitialState.currentStyle.stroke,
        },
      },
    };
    initialState.currentStyle.stroke.width = 5;
    const snapshot = JSON.stringify(initialState);

    const action = MapActions.setStrokeWidth(10);
    const state = mapReducer(initialState, action);

    expect(JSON.stringify(initialState)).toEqual(snapshot);
    expect(state.currentStyle.stroke.width).toEqual(10);
  });
});