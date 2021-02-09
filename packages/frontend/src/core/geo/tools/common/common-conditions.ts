import MapBrowserEvent from 'ol/MapBrowserEvent';

/**
 * Originally we were checking if event was a PointerEvent, and it was handy and simple.
 * But, sometimes it does not !
 */
interface MayContainsButton {
  button?: number;
}

/**
 * Condition that return true if event is main mouse button click event.
 *
 * Used with openlayers interactions.
 *
 * @param ev
 */
export function onlyMainButton(ev: MapBrowserEvent<UIEvent>): boolean {
  const mainButton = 0;
  const originalEvent: MayContainsButton = ev.originalEvent as any;
  if (typeof originalEvent.button !== 'undefined') {
    return originalEvent.button === mainButton;
  }
  return false;
}
