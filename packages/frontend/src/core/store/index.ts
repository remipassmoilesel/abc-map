import { combineReducers, createStore } from 'redux';
import { StorePersistence } from './persistence/StorePersistence';
import { projectReducer } from './project/reducer';
import { projectInitialState } from './project/state';
import { mapReducer } from './map/reducer';
import { mapInitialState } from './map/state';
import { authenticationReducer } from './authentication/reducer';
import { authenticationInitialState } from './authentication/state';
import _ from 'lodash';
import { uiReducer } from './ui/reducer';
import { uiInitialState } from './ui/state';
import { getAbcWindow } from '../AbcWindow';

const rootReducer = combineReducers({
  project: projectReducer,
  map: mapReducer,
  authentication: authenticationReducer,
  ui: uiReducer,
});

export type MainState = ReturnType<typeof rootReducer>;

export function initialState(): MainState {
  return {
    project: projectInitialState,
    map: mapInitialState,
    authentication: authenticationInitialState,
    ui: uiInitialState,
  };
}

const _window = getAbcWindow();
// TODO: make conditional, do not enable in production
const reduxExtension = _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__();

const persistence = StorePersistence.newPersistence();
const preLoadedState = _.defaultsDeep(persistence.loadState(), initialState());

export function storeFactory() {
  return createStore(rootReducer, preLoadedState, reduxExtension);
}

const mainStore = storeFactory();

// At every store change, we persist store state in localstorage, but at most 1 time per second
mainStore.subscribe(
  _.throttle(() => {
    persistence.saveState(mainStore.getState());
  }, 1000)
);

// For tests and debug purposes
_window.abc.store = mainStore;

export type MainStore = typeof mainStore;

export default mainStore;
