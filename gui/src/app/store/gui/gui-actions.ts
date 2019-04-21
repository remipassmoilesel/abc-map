import {Action} from '@ngrx/store';

// Actions are events

export namespace GuiModule {

  export enum ActionTypes {
    DIALOG_SELECT_NEW_LAYER_SHOWED = '[gui] Dialog: Show new layer dialog',
  }

  export class SelectNewLayerDialogChanged implements Action {
    readonly type = ActionTypes.DIALOG_SELECT_NEW_LAYER_SHOWED;

    constructor(public payload: { state: boolean }) {}
  }

  export type ActionsUnion = SelectNewLayerDialogChanged;
}
