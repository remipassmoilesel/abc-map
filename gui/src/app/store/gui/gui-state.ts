export interface IGuiState {
  dialogs: {
    selectNewLayer: boolean
  };
}

export const guiInitialState: IGuiState = {
  dialogs: {
    selectNewLayer: false
  }
};
