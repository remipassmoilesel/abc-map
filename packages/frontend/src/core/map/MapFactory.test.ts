import { DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import { MapFactory } from './MapFactory';
import { Map } from 'ol';

describe('MapFactory', () => {
  it('newDefaultMap()', () => {
    const map = MapFactory.newDefaultMap();
    const layers = map.getLayers().getArray();
    expect(layers).toHaveLength(0);
    expect(map.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
    expect(getControlNames(map)).toEqual(['Attribution', 'Rotate', 'Zoom']);
  });

  it('newNakedMap()', () => {
    const map = MapFactory.newNakedMap();
    const layers = map.getLayers().getArray();
    expect(layers).toHaveLength(0);
    expect(map.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
    expect(getControlNames(map)).toEqual([]);
  });
});

function getControlNames(map: Map): string[] {
  return map
    .getControls()
    .getArray()
    .map((ctr) => ctr.constructor.name)
    .sort((a, b) => a.localeCompare(b));
}
