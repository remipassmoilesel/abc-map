import { combineReducers, createStore } from 'redux';
import { StorePersistence } from './persistence/StorePersistence';
import { projectStateReducer } from './project/reducer';
import { projectInitialState } from './project/state';
import { mapStateReducer } from './map/reducer';
import { mapInitialState } from './map/state';
import { authenticationStateReducer } from './authentication/reducer';
import { authenticationInitialState } from './authentication/state';
import _ from 'lodash';
import { uiStateReducer } from './ui/reducer';
import { uiInitialState } from './ui/state';

const rootReducer = combineReducers({
  project: projectStateReducer,
  map: mapStateReducer,
  authentication: authenticationStateReducer,
  ui: uiStateReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const initialState: RootState = {
  project: projectInitialState,
  map: mapInitialState,
  authentication: authenticationInitialState,
  ui: uiInitialState,
};

// TODO: FIXME: make conditional, do not enable in production
const _window = window as any;
const reduxExtension = _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__();

const persistence = StorePersistence.newPersistence();
const preLoadedState = _.defaultsDeep(persistence.loadState(), initialState);

const mainStore = createStore(rootReducer, preLoadedState, reduxExtension);

// At every store change, we persist store state in localstorage, but at most 1 time per second
mainStore.subscribe(
  _.throttle(() => {
    persistence.saveState(mainStore.getState());
  }, 1000)
);

export type MainStore = typeof mainStore;

export default mainStore;
