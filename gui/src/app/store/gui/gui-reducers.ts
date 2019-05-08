import {guiInitialState, IGuiState} from './gui-state';
import {GuiModule} from './gui-actions';
import * as _ from 'lodash';
import ActionTypes = GuiModule.ActionTypes;

// All objects must be deep cloned

export function guiReducer(state = guiInitialState, action: GuiModule.ActionsUnion): IGuiState {

  switch (action.type) {
    case ActionTypes.DIALOG_SELECT_NEW_LAYER_STATE_CHANGED: {
      const newState = _.cloneDeep(state);
      newState.dialogs.selectNewLayer = action.payload.state;
      return newState;
    }

    case ActionTypes.DOCUMENTS_UPLOADED: {
      const newState = _.cloneDeep(state);
      newState.lastDocumentsUploaded = action.payload.documents;
      return newState;
    }

    default: {
      return state;
    }

  }
}
