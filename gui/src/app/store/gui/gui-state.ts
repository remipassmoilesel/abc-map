import {IUploadResponse} from 'abcmap-shared';

export interface IGuiState {
  dialogs: {
    selectNewLayer: boolean
  };
  lastUploadResponse?: IUploadResponse;
}

export const guiInitialState: IGuiState = {
  dialogs: {
    selectNewLayer: false
  },
};
