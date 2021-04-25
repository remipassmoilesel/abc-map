import MapBrowserEvent from 'ol/MapBrowserEvent';
import { shiftKeyOnly } from 'ol/events/condition';

export function notShiftKey(ev: MapBrowserEvent): boolean {
  return !shiftKeyOnly(ev);
}

export function withShiftKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'shiftKey' in original && original.shiftKey;
}

export function withControlKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'ctrlKey' in original && original.ctrlKey;
}

export function withMainButton(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'button' in original && original.button === 0;
}
