import { HistoryKey } from './HistoryKey';
import { HistoryService, HistoryStack } from './HistoryService';
import { Task } from './Task';
import * as sinon from 'sinon';
import * as uuid from 'uuid';
import { SinonStub } from 'sinon';

// TODO: assert on store.dispatch() calls

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
  let fakeHistory: HistoryStack;
  let dispatchStub: SinonStub;

  beforeEach(() => {
    fakeHistory = {
      [HistoryKey.Map]: {
        done: [new FakeTask(1), new FakeTask(2), new FakeTask(3)],
        undone: [new FakeTask(4), new FakeTask(5), new FakeTask(6)],
      },
    };

    dispatchStub = sinon.stub();
    const fakeStore = {
      dispatch: dispatchStub,
    } as any;

    service = new HistoryService(3, fakeHistory, fakeStore);
  });

  describe('register()', () => {
    it('should create history stack for unknown key', async () => {
      const key = uuid.v4() as HistoryKey;
      await service.register(key, new FakeTask(7));

      expect(fakeHistory[key]).toBeDefined();
      expect(getDoneIds(fakeHistory, key)).toEqual([7]);
      expect(getUndoneIds(fakeHistory, key)).toEqual([]);
    });

    it('should stack task', async () => {
      const key = uuid.v4() as HistoryKey;
      await service.register(key, new FakeTask(8));
      await service.register(key, new FakeTask(9));

      expect(fakeHistory[key]).toBeDefined();
      expect(getDoneIds(fakeHistory, key)).toEqual([8, 9]);
      expect(getUndoneIds(fakeHistory, key)).toEqual([]);
    });

    it('should call dispose() on trashed tasks', async () => {
      const trashedTask = fakeHistory[HistoryKey.Map]?.done[0] as Task;
      const disposeStub = sinon.stub(trashedTask, 'dispose');
      disposeStub.returns(Promise.resolve());

      await service.register(HistoryKey.Map, new FakeTask(8));

      expect(disposeStub.callCount).toEqual(1);
      expect(getDoneIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3, 8]);
    });
  });

  describe('undo()', () => {
    it('should fail if nothing to undo', async () => {
      expect.assertions(1);

      const key = uuid.v4() as HistoryKey;
      await service.undo(key).catch((err) => expect(err.message).toEqual('Nothing to undo'));
    });

    it('should call undo() on last task', async () => {
      const expectedTask = fakeHistory[HistoryKey.Map]?.done[2] as Task;
      const undoStub = sinon.stub(expectedTask, 'undo');

      await service.undo(HistoryKey.Map);

      expect(undoStub.callCount).toEqual(1);
    });

    it('undo() should stack task on undone stack', async () => {
      const trashedTask = fakeHistory[HistoryKey.Map]?.undone[0] as Task;
      const disposeStub = sinon.stub(trashedTask, 'dispose');
      disposeStub.returns(Promise.resolve());

      await service.undo(HistoryKey.Map);

      expect(getDoneIds(fakeHistory, HistoryKey.Map)).toEqual([1, 2]);
      expect(getUndoneIds(fakeHistory, HistoryKey.Map)).toEqual([5, 6, 3]);

      expect(disposeStub.callCount).toEqual(1);
    });
  });

  describe('redo()', () => {
    it('should fail if nothing to redo', async () => {
      expect.assertions(1);

      const key = uuid.v4() as HistoryKey;
      await service.redo(key).catch((err) => expect(err.message).toEqual('Nothing to redo'));
    });

    it('should call redo() on last task', async () => {
      const expectedTask = fakeHistory[HistoryKey.Map]?.undone[2] as Task;
      const undoStub = sinon.stub(expectedTask, 'redo');

      await service.redo(HistoryKey.Map);

      expect(undoStub.callCount).toEqual(1);
    });

    it('undo() should stack task on done stack', async () => {
      const trashedTask = fakeHistory[HistoryKey.Map]?.done[0] as Task;
      const disposeStub = sinon.stub(trashedTask, 'dispose');
      disposeStub.returns(Promise.resolve());

      await service.redo(HistoryKey.Map);

      expect(getDoneIds(fakeHistory, HistoryKey.Map)).toEqual([2, 3, 6]);
      expect(getUndoneIds(fakeHistory, HistoryKey.Map)).toEqual([4, 5]);
      expect(disposeStub.callCount).toEqual(1);
    });
  });

  describe('canUndo()', () => {
    it('should return false', () => {
      const key = uuid.v4() as HistoryKey;
      expect(service.canUndo(key)).toEqual(false);
    });

    it('should return true', () => {
      expect(service.canUndo(HistoryKey.Map)).toEqual(true);
    });
  });

  describe('canRedo()', () => {
    it('should return false', () => {
      const key = uuid.v4() as HistoryKey;
      expect(service.canRedo(key)).toEqual(false);
    });

    it('should return true', () => {
      expect(service.canRedo(HistoryKey.Map)).toEqual(true);
    });
  });
});

function getDoneIds(history: HistoryStack, key: HistoryKey): number[] {
  return history[key]?.done.map((task) => (task as FakeTask).id) as number[];
}

function getUndoneIds(history: HistoryStack, key: HistoryKey): number[] {
  return history[key]?.undone.map((task) => (task as FakeTask).id) as number[];
}
