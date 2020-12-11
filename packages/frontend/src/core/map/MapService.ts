import { AbcLayer, AbcLayerMetadata, AbcProject, DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Map } from 'ol';
import { Logger } from '../utils/Logger';
import { AbcProperties } from './AbcProperties';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import * as E from 'fp-ts/Either';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LayerFactory } from './LayerFactory';
import { AbcWindow } from '../AbcWindow';

const logger = Logger.get('MapService.ts');

export class MapService {
  private mainMap?: Map;

  public newDefaultMap(target: HTMLDivElement): Map {
    return new Map({
      target,
      layers: [this.newOsmLayer()],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
    });
  }

  public resetMap(map: Map): void {
    map.getLayers().clear();
    map.addLayer(this.newOsmLayer());
  }

  /**
   * <p>Set the reference to the main map</p>
   *
   * <p>As Openlayers map are mutable, we do not store them in Redux</p>
   */
  public setMainMap(map: Map | undefined): void {
    const _window: AbcWindow = window as any;
    _window.abc = {
      ..._window.abc,
      mainMap: map, // For debug purposes only
    };
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
  public getManagedLayers(map: Map): BaseLayer[] {
    return map
      .getLayers()
      .getArray()
      .filter((lay) => !!lay.get(AbcProperties.Managed));
  }

  public newOsmLayer(): TileLayer {
    return LayerFactory.newOsmLayer();
  }

  public newVectorLayer(source?: VectorSource): VectorLayer {
    return LayerFactory.newVectorLayer(source);
  }

  public getMetadataFromLayer(layer: BaseLayer): AbcLayerMetadata | undefined {
    return LayerFactory.getMetadataFromLayer(layer);
  }

  public exportLayers(map: Map): AbcLayer[] {
    return this.getManagedLayers(map)
      .map((lay) => {
        const res = LayerFactory.olLayerToAbcLayer(lay);
        if (E.isLeft(res)) {
          logger.error('Export error: ', res);
          return undefined;
        }
        return res.right;
      })
      .filter((lay) => !!lay) as AbcLayer[];
  }

  public importProject(project: AbcProject, map: Map): void {
    map.getLayers().clear();
    project.layers
      .map((lay) => {
        const res = LayerFactory.abcLayerToOlLayer(lay);
        if (E.isLeft(res)) {
          logger.error('Export error: ', res);
          return undefined;
        }
        return res.right;
      })
      .filter((lay) => !!lay)
      .forEach((lay) => map.addLayer(lay as BaseLayer));
  }
}
