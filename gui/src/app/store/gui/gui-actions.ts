import {Action} from '@ngrx/store';

// Actions are events

export namespace GuiModule {

  export enum ActionTypes {
    DIALOG_SELECT_NEW_LAYER_STATE_CHANGED = '[gui] New layer dialog state changed',
  }

  export class SelectNewLayerDialogChanged implements Action {
    readonly type = ActionTypes.DIALOG_SELECT_NEW_LAYER_STATE_CHANGED;

    constructor(public payload: { state: boolean }) {}
  }

  export type ActionsUnion = SelectNewLayerDialogChanged;
}
