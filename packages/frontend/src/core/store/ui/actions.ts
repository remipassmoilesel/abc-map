import { HistoryKey } from '../../history/HistoryKey';

export enum ActionType {
  SetHistoryCapabilities = 'SetHistoryCapabilities',
  CleanHistoryCapabilities = 'CleanHistoryCapabilities',
}

export interface SetHistoryCapabilities {
  type: ActionType.SetHistoryCapabilities;
  key: HistoryKey;
  canUndo: boolean;
  canRedo: boolean;
}

export interface CleanHistoryCapabilities {
  type: ActionType.CleanHistoryCapabilities;
}

export type UiAction = SetHistoryCapabilities | CleanHistoryCapabilities;

export class UiActions {
  public static setHistoryCapabilities(key: HistoryKey, canUndo: boolean, canRedo: boolean): UiAction {
    return {
      type: ActionType.SetHistoryCapabilities,
      key,
      canUndo,
      canRedo,
    };
  }

  public static cleanHistoryCapabilities(): UiAction {
    return {
      type: ActionType.CleanHistoryCapabilities,
    };
  }
}
