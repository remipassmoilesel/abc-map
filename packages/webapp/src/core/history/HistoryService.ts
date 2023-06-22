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
import { Changeset } from './Changeset';
import { Logger } from '@abc-map/shared';
import { UiActions } from '../store/ui/actions';
import { mainStore, MainStore } from '../store/store';

const logger = Logger.get('HistoryService.ts');

const MaxHistoryStackSize = 100;

export declare type HistoryStack = {
  undo: Changeset[];
  redo: Changeset[];
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
    return new HistoryService(MaxHistoryStackSize, {}, mainStore);
  }

  constructor(private maxSize: number, private history: History = {}, private store: MainStore) {}

  public resetHistory(): void {
    for (const key in this.history) {
      const stack = this.getStack(key as HistoryKey);
      stack.undo.forEach((cs) => cs.dispose().catch((err) => logger.error(err)));
      stack.redo.forEach((cs) => cs.dispose().catch((err) => logger.error(err)));
    }
    this.history = {};
    this.store.dispatch(UiActions.cleanHistoryCapabilities());
  }

  public register(key: HistoryKey, cs: Changeset): void {
    const stack = this.getStack(key);

    stack.undo.push(cs);
    stack.redo.forEach((t) => t.dispose().catch((err) => logger.error(err)));
    stack.redo = [];

    this.limitHistorySize(key);
    this.updateUiState(key);
  }

  public remove(key: HistoryKey, cs: Changeset): void {
    const stack = this.getStack(key);

    const trashed: Changeset[] = stack.undo.concat(stack.redo).filter((t) => t === cs);
    trashed?.forEach((t) => t.dispose().catch((err) => logger.error('Error while disposing changeset: ', err)));

    stack.undo = stack.undo.filter((t) => t !== cs);
    stack.redo = stack.redo.filter((t) => t !== cs);

    this.updateUiState(key);
  }

  public async undo(key: HistoryKey): Promise<void> {
    const stack = this.getStack(key);

    const changeset = stack.undo.pop();
    if (!changeset) {
      return Promise.reject(new Error('Nothing to undo'));
    }

    // Changeset reference must be hold in one list reference, in case we want to use remove()
    stack.redo.push(changeset);

    await changeset.undo();

    this.limitHistorySize(key);
    this.updateUiState(key);
  }

  public async redo(key: HistoryKey): Promise<void> {
    const stack = this.getStack(key);

    const changeset = stack.redo.pop();
    if (!changeset) {
      return Promise.reject(new Error('Nothing to redo'));
    }

    // Changeset reference must be hold in one list reference, in case we want to use remove()
    stack.undo.push(changeset);

    await changeset.execute();

    this.limitHistorySize(key);
    this.updateUiState(key);
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
      trashed.forEach((cs) => cs.dispose().catch((err) => logger.error(err)));
      stack.undo = stack.undo.slice(-this.maxSize);
    }

    if (stack.redo.length > this.maxSize) {
      const trashed = stack.redo.slice(0, -this.maxSize);
      trashed.forEach((cs) => cs.dispose().catch((err) => logger.error(err)));
      stack.redo = stack.redo.slice(-this.maxSize);
    }
  }

  private updateUiState(key: HistoryKey): void {
    this.store.dispatch(UiActions.setHistoryCapabilities(key, this.canUndo(key), this.canRedo(key)));
  }
}
