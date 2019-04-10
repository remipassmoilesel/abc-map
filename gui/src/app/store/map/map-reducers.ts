import {IMapState, mapInitialState} from './map-state';
import {MapModule} from './map-actions';
import * as _ from 'lodash';

// All objects must be deep cloned

export function mapReducer(state = mapInitialState, action: MapModule.ActionsUnion): IMapState {

  switch (action.type) {
    case MapModule.ActionTypes.DRAWING_TOOL_CHANGED: {
      const newState = _.cloneDeep(state);
      newState.drawingTool = action.tool;
      return newState;
    }

    case MapModule.ActionTypes.ACTIVE_FOREGROUND_COLOR_CHANGED: {
      const newState = _.cloneDeep(state);
      state.style.activeForegroundColor = action.color;
      return newState;
    }

    case MapModule.ActionTypes.ACTIVE_BACKGROUND_COLOR_CHANGED: {
      const newState = _.cloneDeep(state);
      state.style.activeBackgroundColor = action.color;
      return newState;
    }

    default: {
      return state;
    }

  }
}
