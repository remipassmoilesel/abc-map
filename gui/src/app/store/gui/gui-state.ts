export interface IGuiState {
  dialogs: {
    selectNewLayerShowed: boolean
  }
}

export const guiInitialState: IGuiState = {
  dialogs: {
    selectNewLayerShowed: false
  }
};
