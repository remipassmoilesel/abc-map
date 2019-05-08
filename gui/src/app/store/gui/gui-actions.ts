import {Action} from '@ngrx/store';
import {IUploadResponse} from 'abcmap-shared';

// Actions are events

export namespace GuiModule {

  export enum ActionTypes {
    DIALOG_SELECT_NEW_LAYER_STATE_CHANGED = '[gui] New layer dialog state changed',
    DOCUMENTS_UPLOADED = '[gui] Documents uploaded',
  }

  export class SelectNewLayerDialogChanged implements Action {
    readonly type = ActionTypes.DIALOG_SELECT_NEW_LAYER_STATE_CHANGED;

    constructor(public payload: { state: boolean }) {
    }
  }

  export class DocumentsUploaded implements Action {
    readonly type = ActionTypes.DOCUMENTS_UPLOADED;

    constructor(public payload: { documents: IUploadResponse[] }) {
    }
  }

  export type ActionsUnion = SelectNewLayerDialogChanged | DocumentsUploaded;
}
