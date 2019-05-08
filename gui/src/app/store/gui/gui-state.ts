import {IUploadResponse} from 'abcmap-shared';

export interface IGuiState {
  dialogs: {
    selectNewLayer: boolean
  };
  lastDocumentsUploaded: IUploadResponse[];
}

export const guiInitialState: IGuiState = {
  dialogs: {
    selectNewLayer: false
  },
  lastDocumentsUploaded: []
};
