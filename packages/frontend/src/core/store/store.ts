import _ from 'lodash';
import { StorePersistence } from './persistence/StorePersistence';
import { getAbcWindow } from '../utils/getWindow';
import { initialState } from './state';
import { MainState, mainReducer } from './reducer';
import { createStore, Store } from 'redux';

const persistence = StorePersistence.newPersistence();
const preLoadedState = _.defaultsDeep(persistence.loadState(), initialState());

const _window = getAbcWindow();
const reduxExtension = _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__();

export function storeFactory(preLoadedState?: MainState): Store<MainState> {
  return createStore(mainReducer, preLoadedState, reduxExtension);
}

export const mainStore = storeFactory(preLoadedState);

// At every store change, we persist store state in localstorage, but at most 1 time per second
const persist = _.throttle(() => persistence.saveState(mainStore.getState()), 1000);
mainStore.subscribe(() => persist());

export type MainStore = typeof mainStore;
