import { DragPan, DragRotate, Interaction, MouseWheelZoom } from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';

export function defaultInteractions(): Interaction[] {
  return [new DragPan(), new MouseWheelZoom()];
}

export function drawingInteractions(): Interaction[] {
  return [new DragPan({ condition: shiftKeyOnly }), new MouseWheelZoom({ condition: shiftKeyOnly })];
}

export function layoutMapInteractions(): Interaction[] {
  return [new DragRotate(), new DragPan(), new MouseWheelZoom()];
}
