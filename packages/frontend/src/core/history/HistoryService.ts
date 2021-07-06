/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { HistoryKey } from './HistoryKey';
import { Task } from './Task';
import { Logger } from '@abc-map/shared';
import { UiActions } from '../store/ui/actions';
import { MainStore, mainStore } from '../store/store';

const logger = Logger.get('HistoryService.ts');

export declare type HistoryStack = {
  undo: Task[];
  redo: Task[];
};

export declare type History = {
  [k: string]: HistoryStack | undefined;
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

  constructor(private maxSize: number, private history: History = {}, private store: MainStore) {}

  public resetHistory(): void {
    for (const key in this.history) {
      const stack = this.getStack(key as HistoryKey);
      stack.undo.forEach((task) => task.dispose().catch((err) => logger.error(err)));
      stack.redo.forEach((task) => task.dispose().catch((err) => logger.error(err)));
    }
    this.history = {};
    this.store.dispatch(UiActions.cleanHistoryCapabilities());
  }

  public register(key: HistoryKey, task: Task): void {
    const stack = this.getStack(key);

    stack.undo.push(task);
    stack.redo.forEach((t) => t.dispose().catch((err) => logger.error(err)));
    stack.redo = [];

    this.limitHistorySize(key);
    this.updateUiState(key);
  }

  public async undo(key: HistoryKey): Promise<void> {
    const stack = this.getStack(key);

    const task = stack.undo.pop();
    if (!task) {
      return Promise.reject(new Error('Nothing to undo'));
    }
    stack.redo.push(task);
    this.limitHistorySize(key);
    this.updateUiState(key);

    await task.undo();
  }

  public async redo(key: HistoryKey): Promise<void> {
    const stack = this.getStack(key);

    const task = stack.redo.pop();
    if (!task) {
      return Promise.reject(new Error('Nothing to redo'));
    }
    stack.undo.push(task);
    this.limitHistorySize(key);
    this.updateUiState(key);

    await task.redo();
  }

  public canUndo(key: HistoryKey): boolean {
    const stack = this.getStack(key);
    return stack.undo.length > 0;
  }

  public canRedo(key: HistoryKey): boolean {
    const stack = this.getStack(key);
    return stack.redo.length > 0;
  }

  public getHistory(): History {
    return this.history;
  }

  private getStack(key: HistoryKey): HistoryStack {
    if (!this.history[key]) {
      this.history[key] = {
        undo: [],
        redo: [],
      };
    }
    return this.history[key] as HistoryStack;
  }

  private limitHistorySize(key: HistoryKey): void {
    const stack = this.getStack(key);
    if (stack.undo.length > this.maxSize) {
      const trashed = stack.undo.slice(0, -this.maxSize);
      trashed.forEach((task) => task.dispose().catch((err) => logger.error(err)));
      stack.undo = stack.undo.slice(-this.maxSize);
    }

    if (stack.redo.length > this.maxSize) {
      const trashed = stack.redo.slice(0, -this.maxSize);
      trashed.forEach((task) => task.dispose().catch((err) => logger.error(err)));
      stack.redo = stack.redo.slice(-this.maxSize);
    }
  }

  private updateUiState(key: HistoryKey): void {
    this.store.dispatch(UiActions.setHistoryCapabilities(key, this.canUndo(key), this.canRedo(key)));
  }
}
