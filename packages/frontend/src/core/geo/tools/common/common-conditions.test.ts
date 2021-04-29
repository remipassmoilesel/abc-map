import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { withControlKey, withControlKeyOnly, withGeometry, withMainButton, withShiftKey } from './common-conditions';
import { PluggableMap } from 'ol';
import { LineString } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import Feature from 'ol/Feature';

describe('Common conditions', () => {
  it('withShiftKey()', () => {
    const ev1 = fakeEvent({ shiftKey: true });
    expect(withShiftKey(ev1)).toBe(true);

    const ev2 = fakeEvent({ shiftKey: false });
    expect(withShiftKey(ev2)).toBe(false);
  });

  it('withControlKey()', () => {
    const ev1 = fakeEvent({ ctrlKey: true });
    expect(withControlKey(ev1)).toBe(true);

    const ev2 = fakeEvent({ ctrlKey: false });
    expect(withControlKey(ev2)).toBe(false);
  });

  it('withControlKeyOnly()', () => {
    const ev1 = fakeEvent({ ctrlKey: true, shiftKey: false });
    expect(withControlKeyOnly(ev1)).toBe(true);

    const ev2 = fakeEvent({ ctrlKey: true, shiftKey: true });
    expect(withControlKeyOnly(ev2)).toBe(false);

    const ev3 = fakeEvent({ ctrlKey: false, shiftKey: false });
    expect(withControlKeyOnly(ev3)).toBe(false);
  });

  it('withMainButton()', () => {
    const ev1 = fakeEvent({ button: 0 });
    expect(withMainButton(ev1)).toBe(true);

    const ev2 = fakeEvent({ button: 1 });
    expect(withMainButton(ev2)).toBe(false);
  });

  it('withGeometry()', () => {
    const feature1 = new Feature(
      new LineString([
        [1, 1],
        [2, 2],
      ])
    );

    expect(withGeometry(feature1, GeometryType.LINE_STRING)).toBe(true);
    expect(withGeometry(feature1, GeometryType.POLYGON)).toBe(false);

    const feature2 = new Feature();
    expect(withGeometry(feature2, GeometryType.LINE_STRING)).toBe(false);
  });
});

function fakeEvent(initDict: MouseEventInit): MapBrowserEvent {
  const map: PluggableMap = {} as any;
  const original = new MouseEvent('pointerup', initDict);
  return new MapBrowserEvent(MapBrowserEventType.POINTERUP, map, original);
}
