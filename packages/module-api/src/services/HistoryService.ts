export interface HistoryService {
  register(key: HistoryKey, cs: Changeset): void;
  remove(key: HistoryKey, cs: Changeset): void;
  undo(key: HistoryKey): Promise<void>;
  redo(key: HistoryKey): Promise<void>;
  canUndo(key: HistoryKey): boolean;
  canRedo(key: HistoryKey): boolean;
}

export enum HistoryKey {
  Map = 'Map',
  Export = 'Export',
  SharedViews = 'SharedViews',
}

export interface Changeset {
  apply(): Promise<void>;
  undo(): Promise<void>;
  dispose(): Promise<void>;
}
