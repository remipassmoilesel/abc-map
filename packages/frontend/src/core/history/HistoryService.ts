import { HistoryKey } from './HistoryKey';
import { Task } from './Task';
import { Logger } from '../utils/Logger';
import { UiActions } from '../store/ui/actions';
import { MainStore, mainStore } from '../store/store';

const logger = Logger.get('HistoryService.ts');

export declare type HistoryStack = {
  [k: string]:
    | {
        done: Task[];
        undone: Task[];
      }
    | undefined;
};

/**
 * This service manage several histories in order to let users undo and redo actions.
 *
 * As most of the objects managed here are mutable, we use redux only for states that impact
 * directly UI components, actually canUndo and canRedo only.
 */
export class HistoryService {
  public static create(): HistoryService {
    return new HistoryService(50, {}, mainStore);
  }

  constructor(private maxSize: number, private history: HistoryStack = {}, private store: MainStore) {}

  public clean(): void {
    for (const key in this.history) {
      const done = this.history[key]?.done || [];
      const undone = this.history[key]?.done || [];
      done.forEach((task) => task.dispose().catch((err) => logger.error(err)));
      undone.forEach((task) => task.dispose().catch((err) => logger.error(err)));
    }
    this.history = {};
    this.store.dispatch(UiActions.cleanHistoryCapabilities());
  }

  public register(key: HistoryKey, task: Task): void {
    this.ensureHistory(key);
    this.history[key]?.done.push(task);
    this.limitHistorySize(key);
    this.updateUiState(key);
  }

  public async undo(key: HistoryKey): Promise<void> {
    this.ensureHistory(key);

    const task = this.history[key]?.done.pop();
    if (!task) {
      return Promise.reject(new Error('Nothing to undo'));
    }

    await task.undo();
    this.history[key]?.undone.push(task);

    this.limitHistorySize(key);
    this.updateUiState(key);
  }

  public async redo(key: HistoryKey): Promise<void> {
    this.ensureHistory(key);

    const task = this.history[key]?.undone.pop();
    if (!task) {
      return Promise.reject(new Error('Nothing to redo'));
    }

    await task.redo();
    this.history[key]?.done.push(task);

    this.limitHistorySize(key);
    this.updateUiState(key);
  }

  public canUndo(key: HistoryKey): boolean {
    this.ensureHistory(key);
    const len = this.history[key]?.done.length ?? 0;
    return len > 0;
  }

  public canRedo(key: HistoryKey): boolean {
    this.ensureHistory(key);
    const len = this.history[key]?.undone.length ?? 0;
    return len > 0;
  }

  private ensureHistory(key: HistoryKey): void {
    if (!this.history[key]) {
      this.history[key] = {
        done: [],
        undone: [],
      };
    }
  }

  private limitHistorySize(key: HistoryKey): void {
    const history = this.history[key];
    if (!history) {
      return;
    }

    if (history.done.length > this.maxSize) {
      const trashed = history.done.slice(0, -this.maxSize);
      trashed.forEach((task) => task.dispose().catch((err) => logger.error(err)));
      history.done = history.done.slice(-this.maxSize);
    }

    if (history.undone.length > this.maxSize) {
      const trashed = history.undone.slice(0, -this.maxSize);
      trashed.forEach((task) => task.dispose().catch((err) => logger.error(err)));
      history.undone = history.undone.slice(-this.maxSize);
    }
  }

  private updateUiState(key: HistoryKey): void {
    this.store.dispatch(UiActions.setHistoryCapabilities(key, this.canUndo(key), this.canRedo(key)));
  }
}
