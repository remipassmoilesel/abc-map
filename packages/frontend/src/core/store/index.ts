import { combineReducers, createStore } from 'redux';
import { StorePersistence } from './persistence/StorePersistence';
import { projectStateReducer } from './project/reducer';
import { projectInitialState } from './project/state';
import { mapStateReducer } from './map/reducer';
import { mapInitialState } from './map/state';
import _ from 'lodash';

const rootReducer = combineReducers({
  project: projectStateReducer,
  map: mapStateReducer,
});

const emptyState: RootState = {
  project: projectInitialState,
  map: mapInitialState,
};

export type RootState = ReturnType<typeof rootReducer>;

// TODO: FIXME: make conditional, do not enable in production
const _window = window as any;
const reduxExtension = _window.__REDUX_DEVTOOLS_EXTENSION__ && _window.__REDUX_DEVTOOLS_EXTENSION__();

const persistence = StorePersistence.newPersistence();
const preLoadedState = _.defaultsDeep(persistence.loadState(), emptyState);

const mainStore = createStore(rootReducer, preLoadedState, reduxExtension);

// At every store change, we persist store state in localstorage, but at most 1 time per second
mainStore.subscribe(
  _.throttle(() => {
    persistence.saveState(mainStore.getState());
  }, 1000)
);

export type MainStore = typeof mainStore;

export default mainStore;
