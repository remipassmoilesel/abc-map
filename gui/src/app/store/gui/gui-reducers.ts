import {guiInitialState, IGuiState} from './gui-state';
import {GuiModule} from './gui-actions';
import * as _ from 'lodash';
import ActionTypes = GuiModule.ActionTypes;

// All objects must be deep cloned

export function guiReducer(state = guiInitialState, action: GuiModule.ActionsUnion): IGuiState {

  switch (action.type) {
    case ActionTypes.DIALOG_SELECT_NEW_LAYER_SHOWED: {
      const newState = _.cloneDeep(state);
      newState.dialogs.selectNewLayerShowed = true;
      return newState;
    }

    default: {
      return state;
    }

  }
}
