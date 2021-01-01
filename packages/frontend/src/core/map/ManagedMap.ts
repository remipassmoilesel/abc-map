import { Map } from 'ol';
import { AbcProjection, AbcProperties, LayerProperties, MapTool } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import * as _ from 'lodash';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { FeatureHelper } from './FeatureHelper';
import { ResizeObserverFactory } from '../utils/ResizeObserverFactory';
import BaseEvent from 'ol/events/Event';
import { Interaction } from 'ol/interaction';
import { Logger } from '../utils/Logger';
import { AbstractTool } from './tools/AbstractTool';

export const logger = Logger.get('ManagedMap.ts', 'debug');

/**
 * This class wrap OpenLayers map. The goal is not to replace all methods, but to ensure
 * that critical operations are well done (set active layer, etc ...)
 */
export class ManagedMap {
  private sizeObserver?: ResizeObserver;
  private currentTool?: AbstractTool;
  private drawInteractions: Interaction[] = [];

  constructor(private readonly internal: Map) {
    this.addLayerChangeListener(() => this.updateToolInteractions());
  }

  public dispose() {
    this.internal.dispose();
    this.sizeObserver?.disconnect();
    this.sizeObserver = undefined;
  }

  // TODO: test
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

  public reset(): void {
    this.internal.getLayers().clear();
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
    const id = layer.get(LayerProperties.Id);
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

    // Here we set a property to trigger change
    this.internal.getLayers().set(AbcProperties.LastLayerActive, layerId);
  }

  public getActiveLayer(): BaseLayer | undefined {
    const layers = this.internal.getLayers().getArray();
    return layers.find((lay) => lay.get(LayerProperties.Active));
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
    this.currentTool = tool;
    this.updateToolInteractions();
  }

  private updateToolInteractions(): boolean {
    const map = this.internal;

    // Remove previous interactions
    this.drawInteractions.forEach((inter) => map.removeInteraction(inter));
    this.drawInteractions = [];

    const activeLayer = this.getActiveVectorLayer();
    if (!activeLayer || !this.currentTool || this.currentTool.getId() === MapTool.None) {
      return true;
    }

    this.drawInteractions = this.currentTool.getMapInteractions(activeLayer.getSource());
    this.drawInteractions.forEach((inter) => map.addInteraction(inter));

    logger.debug(`Activated tool '${this.currentTool.getLabel()}'`);
    return true;
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
}
