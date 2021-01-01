import { projectInitialState } from './project/state';
import { mapInitialState } from './map/state';
import { authenticationInitialState } from './authentication/state';
import { uiInitialState } from './ui/state';
import { MainState } from './reducer';

export function initialState(): MainState {
  return {
    project: projectInitialState,
    map: mapInitialState,
    authentication: authenticationInitialState,
    ui: uiInitialState,
  };
}
