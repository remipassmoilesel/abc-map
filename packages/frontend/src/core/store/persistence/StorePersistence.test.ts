import { StorePersistence } from './StorePersistence';
import { LocalStorageService, StorageKey } from '../../utils/LocalStorageService';
import sinon, { SinonStub } from 'sinon';
import { UserStatus } from '@abc-map/shared-entities';
import { MapTool } from '@abc-map/shared-entities';
import { MainState } from '../reducer';

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
    const sampleState: MainState = {
      project: {
        metadata: { name: 'test-project' } as any,
        layouts: [],
      },
      map: {
        tool: MapTool.Point,
        currentStyle: {
          fill: {
            color1: '#789ABC',
            color2: '#789DEF',
          },
          stroke: {
            width: 5,
            color: '#123456',
          },
        },
      },
      authentication: {
        tokenString: 'abcd',
        userStatus: UserStatus.AUTHENTICATED,
        user: {
          id: 'test-user-id',
        } as any,
      },
      ui: {
        historyCapabilities: {
          TestHistoryKey: {
            canUndo: true,
            canRedo: true,
          },
        },
      },
    };
    const snapshot = stateSnapshot(sampleState);

    const expectedState: MainState = {
      project: {
        metadata: undefined,
        layouts: [],
      } as any,
      map: {
        tool: MapTool.None,
        currentStyle: {
          fill: {
            color1: '#789ABC',
            color2: '#789DEF',
          },
          stroke: {
            width: 5,
            color: '#123456',
          },
        },
      },
      authentication: {
        tokenString: 'abcd',
        userStatus: UserStatus.AUTHENTICATED,
        user: {
          id: 'test-user-id',
        } as any,
      },
      ui: {
        historyCapabilities: {},
      },
    };

    persistence.saveState(sampleState);
    expect(setStorageStub.callCount).toEqual(1);

    const call = setStorageStub.getCall(0);
    expect(call.args[0]).toEqual(StorageKey.REDUX_STATE);

    const actualState = JSON.parse(call.args[1]);
    expect(actualState).toEqual(expectedState);

    expect(stateSnapshot(sampleState)).toEqual(snapshot);
  });
});

function stateSnapshot(state: MainState): string {
  return JSON.stringify(state);
}
