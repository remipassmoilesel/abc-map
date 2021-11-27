/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { withControlKey, withControlKeyOnly, withGeometryOfType, withMainButton, withShiftKey } from './common-conditions';
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

    expect(withGeometryOfType(feature1, [GeometryType.LINE_STRING])).toBe(true);
    expect(withGeometryOfType(feature1, [GeometryType.POLYGON])).toBe(false);

    const feature2 = new Feature();
    expect(withGeometryOfType(feature2, [GeometryType.LINE_STRING])).toBe(false);
  });
});

function fakeEvent(initDict: MouseEventInit): MapBrowserEvent<UIEvent> {
  const map: PluggableMap = {} as any;
  const original = new MouseEvent('pointerup', initDict);
  return new MapBrowserEvent(MapBrowserEventType.POINTERUP, map, original);
}
