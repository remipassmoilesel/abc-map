import { Map } from 'ol';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import { MapWrapper } from './MapWrapper';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { layoutMapInteractions } from './interactions';

export class MapFactory {
  public static createDefault(): MapWrapper {
    const scale = new ScaleLine({ units: 'metric' });
    const internal = new Map({
      layers: [],
      controls: defaultControls().extend([scale]),
      interactions: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
    });

    const map = new MapWrapper(internal);
    map.defaultLayers();
    map.setDefaultInteractions();

    return map;
  }

  public static createLayout(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: layoutMapInteractions(),
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
      layers: [],
    });
    return new MapWrapper(internal);
  }

  public static createNaked(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
      layers: [],
    });
    return new MapWrapper(internal);
  }
}
