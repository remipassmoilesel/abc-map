import { LocalStorageService, StorageKey } from '../../core/LocalStorageService';
import { RootState } from '../index';
import { Logger } from '../../core/Logger';
import _ from 'lodash';

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

  public loadState(): RootState | undefined {
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

  public saveState(state: RootState): void {
    const cleanState = _.cloneDeep(state);
    // We can not persist projects above 5MB in local storage
    cleanState.project.current = undefined;
    try {
      const serializedState = JSON.stringify(cleanState);
      this.storage.set(StorageKey.REDUX_STATE, serializedState);
      logger.debug('Saved state: ', serializedState);
    } catch (err) {
      logger.error(err);
    }
  }
}
