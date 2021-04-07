import { Map } from 'ol';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import { MapWrapper } from './MapWrapper';
import { ScaleLine, defaults as defaultControls } from 'ol/control';

export class MapFactory {
  public static createDefault(): MapWrapper {
    const scale = new ScaleLine({ units: 'metric' });
    const internal = new Map({
      controls: defaultControls().extend([scale]),
      layers: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
    });

    const map = new MapWrapper(internal);
    map.resetLayers();
    return map;
  }

  public static createNaked(): MapWrapper {
    const internal = new Map({
      layers: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
      controls: [],
    });
    return new MapWrapper(internal);
  }
}
