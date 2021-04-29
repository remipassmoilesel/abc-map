import { DoubleClickZoom, DragPan, Interaction, KeyboardPan, MouseWheelZoom } from 'ol/interaction';

export function defaultInteractions(): Interaction[] {
  return [new DoubleClickZoom(), new DragPan(), new KeyboardPan(), new MouseWheelZoom()];
}

export function layoutMapInteractions(): Interaction[] {
  return [new DoubleClickZoom(), new DragPan(), new KeyboardPan(), new MouseWheelZoom()];
}
