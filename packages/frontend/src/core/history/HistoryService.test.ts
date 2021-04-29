import { HistoryKey } from './HistoryKey';
import { HistoryService, History } from './HistoryService';
import { Task } from './Task';
import * as sinon from 'sinon';
import uuid from 'uuid-random';
import { SinonStub } from 'sinon';

class FakeTask extends Task {
  constructor(public id: number) {
    super();
  }
  public redo(): Promise<void> {
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    return Promise.resolve();
  }

  public dispose(): Promise<void> {
    return Promise.resolve();
  }
}

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
    const fakeStore = {
      dispatch: dispatchStub,
    } as any;

    service = new HistoryService(3, fakeHistory, fakeStore);
  });

  it('clean() should remove all and call dispose() on each task', () => {
    // Prepare
    const disposeStub = sinon.stub();
    disposeStub.returns(Promise.resolve());
    fakeHistory[HistoryKey.Map]?.redo.forEach((t) => (t.dispose = disposeStub));
    fakeHistory[HistoryKey.Map]?.undo.forEach((t) => (t.dispose = disposeStub));

    // Act
    service.clean();

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
      const trashedTask = fakeHistory[HistoryKey.Map]?.undo[0] as Task;
      const disposeStub = sinon.stub(trashedTask, 'dispose');
      disposeStub.returns(Promise.resolve());

      service.register(HistoryKey.Map, new FakeTask(8));

      expect(disposeStub.callCount).toEqual(1);
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
      const trashedTask = fakeHistory[HistoryKey.Map]?.redo[0] as Task;
      const disposeStub = sinon.stub(trashedTask, 'dispose');
      disposeStub.returns(Promise.resolve());

      await service.undo(HistoryKey.Map);

      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([1, 2]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([5, 6, 3]);

      expect(disposeStub.callCount).toEqual(1);
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
      const trashedTask = fakeHistory[HistoryKey.Map]?.undo[0] as Task;
      const disposeStub = sinon.stub(trashedTask, 'dispose');
      disposeStub.returns(Promise.resolve());

      await service.redo(HistoryKey.Map);

      expect(getUndoStackIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3, 6]);
      expect(getRedoStackIds(fakeHistory, HistoryKey.Map)).toEqual([4, 5]);
      expect(disposeStub.callCount).toEqual(1);
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
});

function getUndoStackIds(history: History, key: HistoryKey): number[] {
  return history[key]?.undo.map((task) => (task as FakeTask).id) as number[];
}

function getRedoStackIds(history: History, key: HistoryKey): number[] {
  return history[key]?.redo.map((task) => (task as FakeTask).id) as number[];
}
