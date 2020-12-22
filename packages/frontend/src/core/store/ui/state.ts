export interface UiState {
  historyCapabilities: {
    [k: string]:
      | {
          canUndo: boolean;
          canRedo: boolean;
        }
      | undefined;
  };
}

export const uiInitialState: UiState = {
  historyCapabilities: {},
};
