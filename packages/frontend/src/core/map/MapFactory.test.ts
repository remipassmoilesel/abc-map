import { DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import { MapFactory } from './MapFactory';

describe('MapFactory', () => {
  it('newDefaultMap()', () => {
    const map = MapFactory.newDefaultMap();
    const layers = map.getLayers().getArray();
    expect(layers).toHaveLength(0);
    expect(map.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
  });
});
