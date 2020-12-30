import { Map } from 'ol';
import { MainStore } from './store';
import { StoreEnhancer } from 'redux';

export interface AbcWindow extends Window {
  abc: {
    mainMap?: Map;
    store?: MainStore;
  };
  __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer<any, any>;
  Cypress?: any;
}

export function getAbcWindow(): AbcWindow {
  const _window: AbcWindow = window as any;
  if (!_window.abc) {
    _window.abc = {};
  }
  return _window;
}
