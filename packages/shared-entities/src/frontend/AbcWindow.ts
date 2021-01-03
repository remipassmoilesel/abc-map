import { E2eMap } from './E2eMap';

export interface AbcWindow extends Window {
  abc: {
    mainMap?: E2eMap;
    services?: any;
  };
  __REDUX_DEVTOOLS_EXTENSION__?: () => any;
  Cypress?: any;
}

export function getAbcWindow(): AbcWindow {
  const _window: AbcWindow = window as any;
  if (!_window.abc) {
    _window.abc = {};
  }
  return _window;
}
