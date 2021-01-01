import { combineReducers } from 'redux';
import { projectReducer } from './project/reducer';
import { mapReducer } from './map/reducer';
import { authenticationReducer } from './authentication/reducer';
import { uiReducer } from './ui/reducer';

export const mainReducer = combineReducers({
  project: projectReducer,
  map: mapReducer,
  authentication: authenticationReducer,
  ui: uiReducer,
});

export type MainState = ReturnType<typeof mainReducer>;
