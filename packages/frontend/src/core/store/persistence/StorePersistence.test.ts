import { StorePersistence } from './StorePersistence';
import { LocalStorageService, StorageKey } from '../../utils/LocalStorageService';
import { RootState } from '../index';
import { SinonStub } from 'sinon';
import { DrawingTools } from '../../map/DrawingTools';
import { Map } from 'ol';
import sinon from 'sinon';

describe('StorePersistence', () => {
  let storage: LocalStorageService;
  let setStorageStub: SinonStub;
  let persistence: StorePersistence;

  beforeEach(() => {
    storage = new LocalStorageService();
    setStorageStub = sinon.stub(storage, 'set');
    persistence = new StorePersistence(storage);
  });

  it('persist should clean state, without undesirable state fields', () => {
    const sampleState: RootState = {
      project: {
        current: { name: 'test-project' } as any,
      },
      map: {
        mainMap: new Map({}),
        drawingTool: DrawingTools.Point,
      },
    };

    const expectedState: RootState = {
      project: {
        current: { name: 'test-project' } as any,
      },
      map: {
        mainMap: undefined as any,
        drawingTool: DrawingTools.None,
      },
    };

    persistence.saveState(sampleState);
    expect(setStorageStub.callCount).toEqual(1);

    const call = setStorageStub.getCall(0);
    expect(call.args[0]).toEqual(StorageKey.REDUX_STATE);

    const actualState = JSON.parse(call.args[1]);
    expect(actualState).toEqual(expectedState);
  });
});
