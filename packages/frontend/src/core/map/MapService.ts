import { AbcLayerMetadata, DEFAULT_PROJECTION, LayerType } from '@abc-map/shared-entities';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Map } from 'ol';
import { Logger } from '../utils/Logger';
import { AbcProperties } from './AbcProperties';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import * as uuid from 'uuid';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const logger = Logger.get('MapService.ts');

export class MapService {
  private mainMap?: Map;

  public newDefaultMap(target: HTMLDivElement): Map {
    return new Map({
      target,
      layers: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
    });
  }

  /**
   * <p>Set the reference to the main map</p>
   *
   * <p>As Openlayers map are mutable, we do not store them in Redux</p>
   */
  public setMainMap(map: Map | undefined): void {
    this.mainMap = map;
  }

  /**
   * <p>Get a reference to the main map</p>
   *
   * <p>As Openlayers map are mutable, we do not store them in Redux</p>
   */
  public getMainMap(): Map | undefined {
    return this.mainMap;
  }

  /**
   * Return layers which belong to
   * @param map
   */
  public getLayers(map: Map): BaseLayer[] {
    return map
      .getLayers()
      .getArray()
      .filter((lay) => !!lay.get(AbcProperties.Managed));
  }

  public newOsmLayer(): TileLayer {
    const layer = new TileLayer({
      source: new OSM(),
    });
    layer.set(AbcProperties.Managed, true);
    layer.set(AbcProperties.LayerId, uuid.v4());
    layer.set(AbcProperties.LayerName, 'OpenStreetMap');
    layer.set(AbcProperties.LayerType, LayerType.Predefined);
    return layer;
  }

  public newVectorLayer(source?: VectorSource): VectorLayer {
    const layer = new VectorLayer({ source });
    layer.set(AbcProperties.Managed, true);
    layer.set(AbcProperties.LayerId, uuid.v4());
    layer.set(AbcProperties.LayerName, 'Vecteurs');
    layer.set(AbcProperties.LayerType, LayerType.Vector);
    return layer;
  }

  public getMetadataFromLayer(layer: BaseLayer): AbcLayerMetadata {
    const id = layer.get(AbcProperties.LayerId);
    const name = layer.get(AbcProperties.LayerName);
    return {
      id,
      name,
      opacity: layer.getOpacity(),
      visible: layer.getVisible(),
    };
  }
}
