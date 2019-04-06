import {IMapState, mapInitialState} from './map-state';
import {MapModule} from './map-actions';

// All objects must be deep cloned

export function mapReducer(state = mapInitialState, action: MapModule.ActionsUnion): IMapState {

  switch (action.type) {
    case MapModule.ActionTypes.DRAWING_TOOL_CHANGED: {
      return {
        ...state,
        drawingTool: action.tool,
      };
    }

    default: {
      return state;
    }

  }
}
