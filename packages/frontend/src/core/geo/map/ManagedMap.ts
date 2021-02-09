import { Map } from 'ol';
import { AbcProjection, AbcProperties, LayerProperties, BaseMetadata, LayerType } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import * as _ from 'lodash';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { FeatureHelper } from '../features/FeatureHelper';
import { ResizeObserverFactory } from '../../utils/ResizeObserverFactory';
import BaseEvent from 'ol/events/Event';
import { Logger } from '../../utils/Logger';
import { AbstractTool } from '../tools/AbstractTool';
import { LayerFactory } from './LayerFactory';
import { LayerMetadataHelper } from './LayerMetadataHelper';
import TileLayer from 'ol/layer/Tile';

export const logger = Logger.get('ManagedMap.ts', 'debug');

/**
 * This class wrap OpenLayers map. The goal is not to replace all methods, but to ensure
 * that critical operations are well done (set active layer, etc ...)
 */
export class ManagedMap {
  private sizeObserver?: ResizeObserver;
  private currentTool?: AbstractTool;

  constructor(private readonly internal: Map) {
    this.addLayerChangeListener(() => {
      this.updateToolInteractions();
      return true;
    });
  }

  public dispose() {
    this.internal.dispose();
    this.sizeObserver?.disconnect();
    this.sizeObserver = undefined;
  }

  public setTarget(node: HTMLDivElement | undefined) {
    this.internal.setTarget(node);

    if (node) {
      // Here we listen to div support size change
      const resizeThrottled = _.throttle(() => this.internal.updateSize(), 300, { trailing: true });
      this.sizeObserver = ResizeObserverFactory.create(() => resizeThrottled());
      this.sizeObserver.observe(node);
    } else {
      this.sizeObserver?.disconnect();
      this.sizeObserver = undefined;
    }
  }

  public resetLayers(): void {
    this.internal.getLayers().clear();
    const osm = LayerFactory.newOsmLayer();
    this.addLayer(osm);

    const vector = LayerFactory.newVectorLayer();
    this.addLayer(vector);
    this.setActiveLayer(vector);
  }

  public addLayer(layer: BaseLayer): void {
    if (!layer.get(AbcProperties.Managed)) {
      throw new Error('You must add custom properties to layers');
    }
    this.internal.addLayer(layer);
  }

  /**
   * Return layers managed layers
   */
  public getLayers(): BaseLayer[] {
    return this.internal
      .getLayers()
      .getArray()
      .filter((lay) => !!lay.get(AbcProperties.Managed));
  }

  public setActiveLayer(layer: BaseLayer): void {
    const id: string | undefined = layer.get(LayerProperties.Id);
    if (!id) {
      throw new Error('Layer is not managed');
    }

    this.setActiveLayerById(id);
  }

  public setActiveLayerById(layerId: string): void {
    const layers = this.getLayers();
    const targetLayers = layers.find((lay) => lay.get(LayerProperties.Id) === layerId);
    if (!targetLayers) {
      throw new Error('Layer does not belong to map');
    }

    layers.forEach((lay) => {
      const id = lay.get(LayerProperties.Id);
      lay.set(LayerProperties.Active, id === layerId);
    });

    this.triggerLayerChange();
  }

  public renameLayer(layer: BaseLayer, name: string): void {
    LayerFactory.setLayerName(layer, name);
    this.triggerLayerChange();
  }

  public getActiveLayer(): BaseLayer | undefined {
    const layers = this.internal.getLayers().getArray();
    return layers.find((lay) => lay.get(LayerProperties.Active));
  }

  public getActiveLayerMetadata(): BaseMetadata | undefined {
    const active = this.getActiveLayer();
    if (active) {
      return LayerMetadataHelper.getCommons(active);
    }
  }

  public removeLayer(layer: BaseLayer): void {
    this.internal.getLayers().remove(layer);
  }

  public getActiveVectorLayer(): VectorLayer | undefined {
    const layer = this.getActiveLayer();
    if (!layer || !(layer instanceof VectorLayer)) {
      return;
    }

    return layer as VectorLayer;
  }

  public layersEquals(others: BaseLayer[]) {
    const layers = this.internal.getLayers().getArray();
    const previousIds: string[] = layers.map((lay) => lay.get(LayerProperties.Id));
    const currentIds: string[] = others.map((lay) => lay.get(LayerProperties.Id));
    const previousActive = layers.find((lay) => lay.get(LayerProperties.Active))?.get(LayerProperties.Id);
    const currentActive = others.find((lay) => lay.get(LayerProperties.Active))?.get(LayerProperties.Id);

    return previousActive === currentActive && _.isEqual(previousIds, currentIds);
  }

  public forEachFeatureSelected(callback: (feat: Feature<Geometry>) => void) {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      return;
    }
    layer.getSource().forEachFeature((feat) => {
      if (FeatureHelper.isSelected(feat)) {
        callback(feat);
      }
    });
  }

  public getProjection(): AbcProjection {
    return {
      name: this.internal.getView().getProjection().getCode(),
    };
  }

  public addLayerChangeListener(handler: (ev: BaseEvent) => boolean) {
    this.internal.getLayers().on('propertychange', handler);
  }

  public removeLayerChangeListener(handler: (ev: BaseEvent) => boolean) {
    this.internal.getLayers().removeEventListener('propertychange', handler);
  }

  public setTool(tool: AbstractTool): void {
    // We dispose previous tool before reference overwrite
    this.currentTool?.dispose();
    this.currentTool = tool;
    this.updateToolInteractions();
  }

  private updateToolInteractions(): void {
    if (!this.currentTool) {
      return;
    }
    this.currentTool.dispose();

    const vectorLayer = this.getActiveVectorLayer();
    if (!vectorLayer) {
      return;
    }

    this.currentTool.setup(this.internal, vectorLayer.getSource());
    logger.debug(`Activated tool '${this.currentTool.getId()}'`);
    return;
  }

  public getCurrentTool(): AbstractTool | undefined {
    return this.currentTool;
  }

  public getInternal(): Map {
    return this.internal;
  }

  public getSizeObserver(): ResizeObserver | undefined {
    return this.sizeObserver;
  }

  public containsCredentials(): boolean {
    const withCredentials = this.internal
      .getLayers()
      .getArray()
      .filter((lay) => LayerMetadataHelper.getCommons(lay)?.type === LayerType.Wms)
      .find((lay) => {
        const meta = LayerMetadataHelper.getWmsMetadata(lay as TileLayer);
        return meta?.auth?.username && meta?.auth?.password;
      });
    return !!withCredentials;
  }

  public setLayerVisible(layer: BaseLayer, value: boolean) {
    layer.setVisible(value);
    this.triggerLayerChange();
  }

  /**
   * This method is used to trigger changes for operations that does not trigger changes normally,
   * like rename layer, or change active layer.
   * @private
   */
  private triggerLayerChange(): void {
    this.internal.getLayers().set(AbcProperties.LastLayerChange, performance.now());
  }

  public getSelectedFeatures(): Feature<Geometry>[] {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      return [];
    }

    return layer
      .getSource()
      .getFeatures()
      .filter((feat) => FeatureHelper.isSelected(feat));
  }
}
