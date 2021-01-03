import { AbcLayer, AbcLayerMetadata, AbcProject } from '@abc-map/shared-entities';
import { Logger } from '../utils/Logger';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import * as E from 'fp-ts/Either';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LayerFactory } from './LayerFactory';
import { ManagedMap } from './ManagedMap';
import { MapFactory } from './MapFactory';
import { AbstractTool } from './tools/AbstractTool';
import { mainStore } from '../store/store';
import { MapActions } from '../store/map/actions';

export const logger = Logger.get('MapService.ts');

export class GeoService {
  private mainMap = MapFactory.createDefault();

  public getMainMap(): ManagedMap {
    return this.mainMap;
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

  public exportLayers(map: ManagedMap): AbcLayer[] {
    return map
      .getLayers()
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

  public importProject(map: ManagedMap, project: AbcProject): void {
    map.getInternal().getLayers().clear();
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
      .forEach((lay) => map.getInternal().addLayer(lay as BaseLayer));
  }

  /**
   * Shallow clone layer
   *
   * /!\ Does not set custom properties, layer can not be exported
   */
  public cloneLayer(layer: BaseLayer): BaseLayer | undefined {
    if (layer instanceof TileLayer) {
      return new TileLayer({ source: layer.getSource() });
    } else if (layer instanceof VectorLayer) {
      return new VectorLayer({ source: layer.getSource() });
    }
  }

  /**
   * Shallow clone all layers present in source map and add them to destMap
   *
   * /!\ Does not set custom properties, layers can not be exported
   */
  public cloneLayers(sourceMap: ManagedMap, destMap: ManagedMap) {
    destMap.reset();
    const projectLayers = sourceMap.getLayers();
    projectLayers.forEach((lay) => {
      const previewLayer = this.cloneLayer(lay);
      if (!previewLayer) {
        return logger.warn(`Layer will not be displayed, format is unknown: ${lay.constructor.name}`);
      }
      destMap.getInternal().addLayer(previewLayer);
    });
  }

  public setMainTool(tool: AbstractTool): void {
    this.getMainMap().setTool(tool);
    mainStore.dispatch(MapActions.setTool(tool.getId()));
  }
}
