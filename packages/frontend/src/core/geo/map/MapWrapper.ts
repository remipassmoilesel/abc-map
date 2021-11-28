/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import Map from 'ol/Map';
import { AbcProjection, AbcView, EPSG_4326, LayerProperties, Logger, PredefinedLayerModel } from '@abc-map/shared';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import { ResizeObserverFactory } from '../../utils/ResizeObserverFactory';
import BaseEvent from 'ol/events/Event';
import { Tool } from '../../tools/Tool';
import TileLayer from 'ol/layer/Tile';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { LayerFactory } from '../layers/LayerFactory';
import { LayerWrapper, OlLayers, VectorLayerWrapper } from '../layers/LayerWrapper';
import { EventType, MapSizeChangedEvent, SizeListener, TileErrorListener, TileLoadErrorEvent } from './MapWrapper.events';
import { Views } from '../Views';
import { fromLonLat, transformExtent } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import TileSource from 'ol/source/Tile';
import { Extent } from 'ol/extent';
import { DragPan, KeyboardPan, MouseWheelZoom } from 'ol/interaction';

export const logger = Logger.get('MapWrapper.ts');

export declare type LayerChangeHandler = (ev: BaseEvent) => void;

export declare type FeatureCallback = (feat: FeatureWrapper, layer: VectorLayerWrapper) => void;

/**
 * This class wrap OpenLayers map. The goal is not to replace all methods, but to ensure
 * that critical operations are well done (set active layer, etc ...)
 */
export class MapWrapper {
  private sizeObserver?: ResizeObserver;
  private currentTool?: Tool;
  private eventTarget = document.createDocumentFragment();

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
      const resize = debounce(this.handleSizeChange, 100);
      this.sizeObserver = ResizeObserverFactory.create(resize);
      this.sizeObserver.observe(node);
    } else {
      this.sizeObserver?.disconnect();
      this.sizeObserver = undefined;
    }
  }

  public setDefaultLayers(): void {
    this.internal.getLayers().clear();
    const osm = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    this.addLayer(osm);

    const vector = LayerFactory.newVectorLayer();
    this.addLayer(vector);
    this.setActiveLayer(vector);
  }

  public addLayer(layer: LayerWrapper, position?: number): void {
    const olLayer = layer.unwrap();
    if (typeof position !== 'undefined') {
      this.internal.getLayers().insertAt(position, olLayer);
    } else {
      this.internal.addLayer(olLayer);
    }

    if (olLayer instanceof TileLayer) {
      olLayer.getSource().on('tileloaderror', this.handleTileLoadError);
    }
  }

  /**
   * Return layers managed layers
   */
  public getLayers(): LayerWrapper[] {
    return this.internal
      .getLayers()
      .getArray()
      .filter((lay) => LayerWrapper.isManaged(lay))
      .map((lay) => LayerWrapper.from(lay as OlLayers));
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
    const olLayer = layer.unwrap();
    this.internal.getLayers().remove(olLayer);

    if (olLayer instanceof TileLayer) {
      olLayer.getSource().un('tileloaderror', this.handleTileLoadError);
    }
  }

  public getActiveVectorLayer(): VectorLayerWrapper | undefined {
    const layer = this.getActiveLayer();
    if (layer && layer.isVector()) {
      return layer;
    }
  }

  /**
   * Call callback with each selected feature in **active vector layer**.
   *
   * Return number of feature processed.
   *
   * @param callback
   */
  public forEachFeatureSelected(callback: FeatureCallback): number {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      return 0;
    }

    let i = 0;
    layer.getSource().forEachFeature((feat) => {
      const feature = FeatureWrapper.from(feat);
      if (feature.isSelected()) {
        callback(feature, layer);
        i++;
      }
    });

    return i;
  }

  public getSelectedFeatures(): FeatureWrapper[] {
    const layer = this.getActiveVectorLayer();
    if (!layer) {
      return [];
    }

    return layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f))
      .filter((f) => f.isSelected());
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

  public setTool(tool: Tool): void {
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
    [new DragPan(), new KeyboardPan(), new MouseWheelZoom()].forEach((i) => this.internal.addInteraction(i));
  }

  public cleanInteractions() {
    this.internal.getInteractions().forEach((i) => i.dispose());
    this.internal.getInteractions().clear();
  }

  public getTool(): Tool | undefined {
    return this.currentTool;
  }

  public getSizeObserver(): ResizeObserver | undefined {
    return this.sizeObserver;
  }

  public setLayerVisible(layer: LayerWrapper, value: boolean) {
    layer.setVisible(value);
    this.triggerLayerChange();
  }

  /**
   * This method trigger layer change listeners.
   *
   * Listeners can listen for layer added events, removed, renamed, opacity changed, etc ...
   */
  public triggerLayerChange(): void {
    this.internal.getLayers().set(LayerProperties.LastLayerChange, performance.now());
  }

  /**
   * Move to specified extent. Extent numbers are: minX, minY, maxX, maxY.
   *
   * Source projection is assumed EPSG4326
   */
  public moveViewToExtent(extent: Extent, sourceProjection?: AbcProjection, duration = 1500): void {
    const _sourceProj = sourceProjection || EPSG_4326;
    const _extent = transformExtent(extent, _sourceProj.name, this.getView().projection.name);

    const view = this.internal.getView();
    view.fit(_extent, { duration });
  }

  /**
   * Source projection is assumed EPSG4326
   */
  public moveViewToPosition(coords: Coordinate, zoom: number): void {
    const view = this.internal.getView();
    view.setCenter(fromLonLat(coords, this.getView().projection.name));
    view.setZoom(zoom);
  }

  public getTextAttributions(): string[] {
    const attributions = this.getLayers()
      .filter((lay) => lay.isVisible())
      .flatMap((lay) => lay.getAttributions())
      .filter((attr) => !!attr) as string[];

    return uniq(attributions); // Some attributions can appear twice
  }

  public setView(view: AbcView) {
    this.internal.setView(Views.abcToOl(view));
  }

  public getView(): AbcView {
    return Views.olToAbc(this.internal.getView());
  }

  public addSizeListener(listener: SizeListener): void {
    this.eventTarget.addEventListener(EventType.MapSizeChanged, listener as EventListener);
  }

  public removeSizeListener(listener: SizeListener): void {
    this.eventTarget.removeEventListener(EventType.MapSizeChanged, listener as EventListener);
  }

  public addTileErrorListener(listener: TileErrorListener): void {
    this.eventTarget.addEventListener(EventType.TileLoadError, listener as EventListener);
  }

  public removeTileErrorListener(listener: TileErrorListener): void {
    this.eventTarget.removeEventListener(EventType.TileLoadError, listener as EventListener);
  }

  private handleSizeChange = () => {
    // Each time support size change, we update map
    this.internal.updateSize();

    // Then we notify listeners
    const target = this.internal.getTarget();
    if (!target || !(target instanceof HTMLDivElement)) {
      logger.error('Invalid target, size event will not be dispatched');
      return;
    }

    this.eventTarget.dispatchEvent(new MapSizeChangedEvent({ width: target.clientWidth, height: target.clientHeight }));
  };

  private handleTileLoadError = (ev: BaseEvent) => {
    if (!(ev.target instanceof TileSource)) {
      logger.error('Unhandled event target: ', ev);
      return true;
    }

    const layer = this.internal
      .getLayers()
      .getArray()
      .find((lay) => lay instanceof TileLayer && lay.getSource() === ev.target) as TileLayer<TileSource> | undefined;

    if (layer) {
      this.eventTarget.dispatchEvent(new TileLoadErrorEvent(LayerWrapper.from(layer)));
    }

    return true;
  };

  public unwrap(): Map {
    return this.internal;
  }
}
