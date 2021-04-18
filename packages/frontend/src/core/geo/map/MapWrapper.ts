import { Map } from 'ol';
import { AbcProjection, AbcProperties, VectorMetadata } from '@abc-map/shared-entities';
import * as _ from 'lodash';
import { ResizeObserverFactory } from '../../utils/ResizeObserverFactory';
import BaseEvent from 'ol/events/Event';
import { Logger } from '@abc-map/frontend-shared';
import { AbstractTool } from '../tools/AbstractTool';
import TileLayer from 'ol/layer/Tile';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { LayerFactory } from '../layers/LayerFactory';
import { LayerWrapper, VectorLayerWrapper } from '../layers/LayerWrapper';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { defaultInteractions } from './interactions';

export const logger = Logger.get('MapWrapper.ts', 'debug');

export declare type LayerChangeHandler = (ev: BaseEvent) => void;

export declare type FeatureCallback = (feat: FeatureWrapper, layer: LayerWrapper<VectorImageLayer, VectorSource<Geometry>, VectorMetadata>) => void;

/**
 * This class wrap OpenLayers map. The goal is not to replace all methods, but to ensure
 * that critical operations are well done (set active layer, etc ...)
 */
export class MapWrapper {
  private sizeObserver?: ResizeObserver;
  private currentTool?: AbstractTool;

  constructor(private readonly internal: Map) {
    this.addLayerChangeListener(this.handleLayerChange);
  }

  public dispose() {
    this.removeLayerChangeListener(this.handleLayerChange);
    this.internal.dispose();
    this.sizeObserver?.disconnect();
    this.sizeObserver = undefined;
  }

  public setTarget(node: HTMLDivElement | undefined) {
    this.internal.setTarget(node);

    if (node) {
      // Here we listen to div support size change
      const resize = _.throttle(() => this.internal.updateSize(), 300, { trailing: true });
      this.sizeObserver = ResizeObserverFactory.create(resize);
      this.sizeObserver.observe(node);
    } else {
      this.sizeObserver?.disconnect();
      this.sizeObserver = undefined;
    }
  }

  public defaultLayers(): void {
    this.internal.getLayers().clear();
    const osm = LayerFactory.newOsmLayer();
    this.addLayer(osm);

    const vector = LayerFactory.newVectorLayer();
    this.addLayer(vector);
    this.setActiveLayer(vector);
  }

  public addLayer(layer: LayerWrapper): void {
    this.internal.addLayer(layer.unwrap());
  }

  /**
   * Return layers managed layers
   */
  public getLayers(): LayerWrapper[] {
    return this.internal
      .getLayers()
      .getArray()
      .filter((lay) => LayerWrapper.isManaged(lay))
      .map((lay) => LayerWrapper.from(lay as TileLayer | VectorImageLayer));
  }

  public setActiveLayer(layer: LayerWrapper): void {
    const id: string | undefined = layer.getId();
    if (!id) {
      throw new Error('Layer is not managed');
    }

    this.setActiveLayerById(id);
  }

  public setActiveLayerById(layerId: string): void {
    const layers = this.getLayers();
    const targetLayers = layers.find((lay) => lay.getId() === layerId);
    if (!targetLayers) {
      throw new Error('Layer does not belong to map');
    }

    layers.forEach((lay) => {
      const id = lay.getId();
      lay.setActive(id === layerId);
    });

    this.triggerLayerChange();
  }

  public renameLayer(layer: LayerWrapper, name: string): void {
    layer.setName(name);
    this.triggerLayerChange();
  }

  public getActiveLayer(): LayerWrapper | undefined {
    const layers = this.getLayers();
    return layers.find((lay) => lay.isActive());
  }

  public removeLayer(layer: LayerWrapper): void {
    this.internal.getLayers().remove(layer.unwrap());
  }

  public getActiveVectorLayer(): VectorLayerWrapper | undefined {
    const layer = this.getActiveLayer();
    if (layer && layer.isVector()) {
      return layer;
    }
  }

  public forEachFeatureSelected(callback: FeatureCallback) {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      return;
    }
    layer.getSource().forEachFeature((feat) => {
      const feature = FeatureWrapper.from(feat);
      if (feature.isSelected()) {
        callback(feature, layer);
      }
    });
  }

  public getProjection(): AbcProjection {
    return {
      name: this.internal.getView().getProjection().getCode(),
    };
  }

  public addLayerChangeListener(handler: LayerChangeHandler) {
    this.internal.getLayers().on('propertychange', handler);
  }

  public removeLayerChangeListener(handler: LayerChangeHandler) {
    this.internal.getLayers().un('propertychange', handler);
  }

  public setTool(tool: AbstractTool): void {
    this.currentTool?.dispose();
    this.currentTool = tool;
    this.updateInteractions();
  }

  private handleLayerChange = () => {
    if (!this.currentTool) {
      this.setDefaultInteractions();
      return;
    }

    this.currentTool.dispose();
    this.updateInteractions();
  };

  private updateInteractions() {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      this.setDefaultInteractions();
      return;
    }

    this.cleanInteractions();

    this.currentTool?.setup(this.internal, layer.getSource());
    logger.debug(`Activated tool '${this.currentTool?.getId()}'`);
    return;
  }

  public setDefaultInteractions() {
    this.cleanInteractions();

    defaultInteractions().forEach((i) => this.internal.addInteraction(i));
  }

  public cleanInteractions() {
    const mapInteractions = this.internal.getInteractions().getArray();
    mapInteractions.forEach((i) => this.internal.removeInteraction(i));
  }

  public getCurrentTool(): AbstractTool | undefined {
    return this.currentTool;
  }

  public getSizeObserver(): ResizeObserver | undefined {
    return this.sizeObserver;
  }

  public containsCredentials(): boolean {
    const withCredentials = this.getLayers().find((lay) => {
      if (lay.isWms()) {
        const meta = lay.getMetadata();
        return meta?.auth?.username && meta?.auth?.password;
      }
      return false;
    });

    return !!withCredentials;
  }

  public setLayerVisible(layer: LayerWrapper, value: boolean) {
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

  public getSelectedFeatures(): FeatureWrapper[] {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      return [];
    }

    return layer
      .getSource()
      .getFeatures()
      .map((feat) => {
        const feature = FeatureWrapper.from(feat);
        return feature.isSelected() ? feature : null;
      })
      .filter((feat) => !!feat) as FeatureWrapper[];
  }

  /**
   * Move to specified extent. Numbers are: minX, minY, maxX, maxY.
   */
  public moveTo(extent: [number, number, number, number]): void {
    const duration = 1500;
    const view = this.internal.getView();
    view.fit(extent, { duration });
  }

  public unwrap(): Map {
    return this.internal;
  }
}
