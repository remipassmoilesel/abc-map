import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FeatureLike } from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';

export function withShiftKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'shiftKey' in original && original.shiftKey;
}

export function withControlKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'ctrlKey' in original && original.ctrlKey;
}

export function withControlKeyOnly(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  return withControlKey(ev) && !withShiftKey(ev) && !withAltKey(ev);
}

export function withAltKey(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'altKey' in original && original.altKey;
}

export function withMainButton(ev: MapBrowserEvent<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): boolean {
  const original = ev.originalEvent;
  return 'button' in original && original.button === 0;
}

export function withGeometry(feat: FeatureLike, type: GeometryType): boolean {
  return feat && feat.getGeometry()?.getType() === type;
}
