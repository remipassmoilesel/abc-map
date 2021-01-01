import { DEFAULT_PROJECTION, LayerProperties } from '@abc-map/shared-entities';
import { Map } from 'ol';
import { MapFactory } from './MapFactory';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';

describe('MapFactory', () => {
  // TODO: check that vector layer is enabled
  it('createDefault()', () => {
    const managed = MapFactory.createDefault();
    const internal = managed.getInternal();
    const layers = internal.getLayers().getArray();
    expect(layers).toHaveLength(2);
    expect(layers[0]).toBeInstanceOf(TileLayer);
    expect(layers[1]).toBeInstanceOf(VectorLayer);
    expect(layers[0].get(LayerProperties.Active)).toBeFalsy();
    expect(layers[1].get(LayerProperties.Active)).toBeTruthy();
    expect(internal.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
    expect(getControlNames(internal)).toEqual(['Attribution', 'Rotate', 'Zoom']);
  });

  it('createNaked()', () => {
    const managed = MapFactory.createNaked();
    const internal = managed.getInternal();
    const layers = internal.getLayers().getArray();
    expect(layers).toHaveLength(0);
    expect(internal.getView().getProjection().getCode()).toEqual(DEFAULT_PROJECTION.name);
    expect(getControlNames(internal)).toEqual([]);
  });
});

function getControlNames(map: Map): string[] {
  return map
    .getControls()
    .getArray()
    .map((ctr) => ctr.constructor.name)
    .sort((a, b) => a.localeCompare(b));
}
