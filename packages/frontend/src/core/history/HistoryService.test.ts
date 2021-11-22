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
import { History, HistoryService } from './HistoryService';
import { Task } from './Task';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import uuid from 'uuid-random';
import { FakeTask, getRedoStackIds, getUndoStackIds } from './HistoryService.test.helpers';
import { UndoCallbackTask } from './tasks/features/UndoCallbackTask';

describe('HistoryService', () => {
  let service: HistoryService;
  let fakeHistory: History;
  let dispatchStub: SinonStub;

  beforeEach(() => {
    fakeHistory = {
      [HistoryKey.Map]: {
        undo: [new FakeTask(1), new FakeTask(2), new FakeTask(3)],
        redo: [new FakeTask(4), new FakeTask(5), new FakeTask(6)],
      },
    };

    dispatchStub = sinon.stub();
    const fakeStore = { dispatch: dispatchStub } as any;

    service = new HistoryService(3, fakeHistory, fakeStore);
  });

  it('clean() should remove all and call dispose() on each task', () => {
    // Prepare
    const disposeStub = sinon.stub();
    disposeStub.returns(Promise.resolve());
    fakeHistory[HistoryKey.Map]?.redo.forEach((t) => (t.dispose = disposeStub));
    fakeHistory[HistoryKey.Map]?.undo.forEach((t) => (t.dispose = disposeStub));

    // Act
    service.resetHistory();

    // Assert
    expect(service.getHistory()).toEqual({});
    expect(disposeStub.callCount).toEqual(6);

    expect(dispatchStub.callCount).toEqual(1);
    expect(dispatchStub.args[0][0]).toEqual({ type: 'CleanHistoryCapabilities' });
  });

  describe('register()', () => {
    it('should create history stack for unknown key then dispatch', async () => {
      const key = uuid() as HistoryKey;
      await service.register(key, new FakeTask(7));

      expect(fakeHistory[key]).toBeDefined();
      expect(getUndoStackIds(fakeHistory, key)).toEqual([7]);
      expect(getRedoStackIds(fakeHistory, key)).toEqual([]);

      expect(dispatchStub.callCount).toEqual(1);
      expect(dispatchStub.args[0][0]).toEqual({ key, canRedo: false, canUndo: true, type: 'SetHistoryCapabilities' });
    });

    it('should stack task', async () => {
      const key = uuid() as HistoryKey;
      await service.register(key, new FakeTask(8));
      await service.register(key, new FakeTask(9));

      expect(fakeHistory[key]).toBeDefined();
      expect(getUndoStackIds(fakeHistory, key)).toEqual([8, 9]);
      expect(getRedoStackIds(fakeHistory, key)).toEqual([]);
    });

    it('should trash task out of limit, and call dispose() on each task', async () => {
      const trashedTask = fakeHistory[HistoryKey.Map]?.undo[0] as FakeTask;

      service.register(HistoryKey.Map, new FakeTask(8));

      expect(trashedTask.dispose.callCount).toEqual(1);
      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3, 8]);
    });

    it('should truncate redo tasks, and call dispose() on each task', async () => {
      const disposeStub = sinon.stub();
      disposeStub.returns(Promise.resolve());
      fakeHistory[HistoryKey.Map]?.redo.forEach((t) => (t.dispose = disposeStub));

      service.register(HistoryKey.Map, new FakeTask(8));

      expect(disposeStub.callCount).toEqual(3);
      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3, 8]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([]);
    });
  });

  describe('undo()', () => {
    it('should fail if nothing to undo', async () => {
      expect.assertions(1);

      const key = uuid() as HistoryKey;
      await service.undo(key).catch((err) => expect(err.message).toEqual('Nothing to undo'));
    });

    it('should call undo() on last task then dispatch', async () => {
      const expectedTask = fakeHistory[HistoryKey.Map]?.undo[2] as Task;
      const undoStub = sinon.stub(expectedTask, 'undo');

      await service.undo(HistoryKey.Map);

      expect(undoStub.callCount).toEqual(1);

      expect(dispatchStub.callCount).toEqual(1);
      expect(dispatchStub.args[0][0]).toEqual({ key: HistoryKey.Map, canRedo: true, canUndo: true, type: 'SetHistoryCapabilities' });
    });

    it('undo() should stack task on redo stack', async () => {
      const trashedTask = fakeHistory[HistoryKey.Map]?.redo[0] as FakeTask;

      await service.undo(HistoryKey.Map);

      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([1, 2]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([5, 6, 3]);

      expect(trashedTask.dispose.callCount).toEqual(1);
    });
  });

  describe('redo()', () => {
    it('should fail if nothing to redo', async () => {
      expect.assertions(1);

      const key = uuid() as HistoryKey;
      await service.redo(key).catch((err) => expect(err.message).toEqual('Nothing to redo'));
    });

    it('should call redo() on last task then dispatch', async () => {
      const expectedTask = fakeHistory[HistoryKey.Map]?.redo[2] as Task;
      const undoStub = sinon.stub(expectedTask, 'redo');

      await service.redo(HistoryKey.Map);

      expect(undoStub.callCount).toEqual(1);

      expect(dispatchStub.callCount).toEqual(1);
      expect(dispatchStub.args[0][0]).toEqual({ key: HistoryKey.Map, canRedo: true, canUndo: true, type: 'SetHistoryCapabilities' });
    });

    it('undo() should stack task on undo stack', async () => {
      const trashedTask = fakeHistory[HistoryKey.Map]?.undo[0] as FakeTask;

      await service.redo(HistoryKey.Map);

      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3, 6]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([4, 5]);
      expect(trashedTask.dispose.callCount).toEqual(1);
    });
  });

  describe('canUndo()', () => {
    it('should return false', () => {
      const key = uuid() as HistoryKey;
      expect(service.canUndo(key)).toEqual(false);
    });

    it('should return true', () => {
      expect(service.canUndo(HistoryKey.Map)).toEqual(true);
    });
  });

  describe('canRedo()', () => {
    it('should return false', () => {
      const key = uuid() as HistoryKey;
      expect(service.canRedo(key)).toEqual(false);
    });

    it('should return true', () => {
      expect(service.canRedo(HistoryKey.Map)).toEqual(true);
    });
  });

  describe('remove()', () => {
    it('should remove nothing', () => {
      service.remove(HistoryKey.Map, new FakeTask(6));

      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([1, 2, 3]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([4, 5, 6]);
    });

    it('should remove tasks', () => {
      const trashedTask1 = fakeHistory[HistoryKey.Map]?.undo[0] as FakeTask;
      const trashedTask2 = fakeHistory[HistoryKey.Map]?.redo[0] as FakeTask;

      service.remove(HistoryKey.Map, trashedTask1);
      service.remove(HistoryKey.Map, trashedTask2);

      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([5, 6]);
      expect(trashedTask1.dispose.callCount).toEqual(1);
      expect(trashedTask2.dispose.callCount).toEqual(1);
    });

    it('can be called in task', async () => {
      // Prepare
      const task = new UndoCallbackTask(() => {
        service.remove(HistoryKey.Map, task);
      });
      service.register(HistoryKey.Map, task);

      // Act
      await service.undo(HistoryKey.Map);

      // Assert
      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([]);
      expect(task.onUndo).toBeUndefined();
    });
  });
});
