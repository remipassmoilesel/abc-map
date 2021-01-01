import { AbcWindow } from '@abc-map/shared-entities';

export function getAbcWindow(): AbcWindow {
  const _window: AbcWindow = window as any;
  if (!_window.abc) {
    _window.abc = {};
  }
  return _window;
}
