// FIXME: use do() instead of redo ?
export abstract class Task {
  public abstract undo(): Promise<void>;
  public abstract redo(): Promise<void>;
  public dispose(): Promise<void> {
    return Promise.resolve();
  }
}
