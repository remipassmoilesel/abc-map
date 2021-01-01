import { Map } from 'ol';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import { LayerFactory } from './LayerFactory';
import { ManagedMap } from './ManagedMap';

export class MapFactory {
  public static createDefault(): ManagedMap {
    const internal = new Map({
      layers: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
    });
    const map = new ManagedMap(internal);
    map.addLayer(LayerFactory.newOsmLayer());
    map.addLayer(LayerFactory.newVectorLayer());
    map.setActiveLayer(map.getLayers()[1]);
    return map;
  }

  public static createNaked(): ManagedMap {
    const internal = new Map({
      layers: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
      controls: [],
    });
    return new ManagedMap(internal);
  }
}
