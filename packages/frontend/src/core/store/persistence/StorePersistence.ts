import { LocalStorageService, StorageKey } from '../../utils/LocalStorageService';
import { Logger, MapTool } from '@abc-map/frontend-shared';
import { MainState } from '../reducer';

const logger = Logger.get('StorePersistence', 'warn');

/**
 * This class persist Redux store in local storage in order to keep settings.
 *
 * Some state fields are erased before save (in order to get a consistent state at app startup)
 *
 */
export class StorePersistence {
  public static newPersistence() {
    return new StorePersistence(new LocalStorageService());
  }

  constructor(private storage: LocalStorageService) {}

  public loadState(): MainState | undefined {
    try {
      const serializedState = this.storage.get(StorageKey.REDUX_STATE);
      if (!serializedState) {
        return undefined;
      }
      const res = JSON.parse(serializedState);
      logger.debug('Loaded state: ', res);
      return res;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  /**
   * Clone state then store it in local storage.
   *
   * WARNING: this method can cause performance issues, beware of the map reference
   * @param state
   */
  public saveState(state: MainState): void {
    const cleanState: MainState = {
      ...state,
      project: {
        ...state.project,
      },
      map: {
        ...state.map,
      },
      ui: {
        ...state.ui,
      },
    };
    cleanState.project.metadata = undefined as any; // New project will be set at store bootstrap
    cleanState.map.tool = MapTool.None;
    cleanState.ui.historyCapabilities = {};
    try {
      const serializedState = JSON.stringify(cleanState);
      this.storage.set(StorageKey.REDUX_STATE, serializedState);
      logger.debug('Saved state: ', serializedState);
    } catch (err) {
      logger.error(err);
    }
  }
}
