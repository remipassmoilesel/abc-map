import {Action} from '@ngrx/store';

// Actions are events

export namespace GuiModule {

  export enum ActionTypes {
    DIALOG_SELECT_NEW_LAYER_SHOWED = '[gui] Dialog: Select new layer showed',
  }

  export class DialogSelectNewLayerShowed implements Action {
    readonly type = ActionTypes.DIALOG_SELECT_NEW_LAYER_SHOWED;

    constructor() {}
  }

  export type ActionsUnion = DialogSelectNewLayerShowed;
}
