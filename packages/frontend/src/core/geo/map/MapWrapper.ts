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
import { ToolMode } from '../../tools/ToolMode';
import PluggableMap from 'ol/PluggableMap';
import { ToolModeHelper } from '../../tools/common/ToolModeHelper';
import { MoveMapTool } from '../../tools/move/MoveMapTool';
import { StyleFactoryOptions } from '../styles/StyleFactoryOptions';
import { DimensionsPx } from '../../utils/DimensionsPx';
import { toPrecision } from '../../utils/numbers';
import { getRemSize } from '../../ui/getRemSize';

export const logger = Logger.get('MapWrapper.ts');

export declare type LayerChangeHandler = (ev: BaseEvent) => void;

export declare type ToolChangedHandler = (ev: BaseEvent) => void;

export declare type FeatureCallback = (feat: FeatureWrapper, layer: VectorLayerWrapper) => void;

const ToolChangedEvent = 'abc:map:tool-changed';

const ToolProperty = 'abc:map:tool';

/**
 * This class wrap OpenLayers map. The goal is not to replace all methods, but to ensure
 * that critical operations are well done (set active layer, etc ...)
 */
export class MapWrapper {
  public static from(map: PluggableMap): MapWrapper {
    if (!(map instanceof Map)) {
      throw new Error('Invalid map: ' + (map ?? 'undefined'));
    }

    return new MapWrapper(map);
  }

  public static fromUnknown(map: unknown): MapWrapper | undefined {
    if (!(map instanceof Map)) {
      return undefined;
    }

    return new MapWrapper(map);
  }

  private mapSizeObserver?: ResizeObserver;
  private bodySizeObserver?: ResizeObserver;
  private eventTarget = document.createDocumentFragment();

  /**
   * This size approximates the size of the main editing map.
   *
   * As users choose the styles on the main map, when exporting and sharing a "ratio" is
   * used to display the symbols in a consistent way.
   *
   * In pixels.
   */
  private mainReferenceSize: DimensionsPx = { width: 0, height: 0 };

  private constructor(private readonly internalMap: Map) {
    this.addLayerChangeListener(this.handleLayerChange);

    this.bodySizeObserver = ResizeObserverFactory.create(debounce(this.updateMainSizeReference, 100));
    this.bodySizeObserver.observe(document.body);
    this.updateMainSizeReference();
  }

  public dispose() {
    this.removeLayerChangeListener(this.handleLayerChange);

    this.mapSizeObserver?.disconnect();
    this.mapSizeObserver = undefined;

    this.bodySizeObserver?.disconnect();
    this.bodySizeObserver = undefined;

    this.internalMap.dispose();
  }

  public setTarget(node: HTMLDivElement | undefined) {
    this.internalMap.setTarget(node);

    if (node) {
      // Here we listen to div support size change
      const resize = debounce(this.handleSizeChange, 100);
      this.mapSizeObserver = ResizeObserverFactory.create(resize);
      this.mapSizeObserver.observe(node);
    } else {
      this.mapSizeObserver?.disconnect();
      this.mapSizeObserver = undefined;
    }
  }

  /**
   * Register a listener that will be executed when:
   * - User modify view
   * - Map is resized
   *
   * @param listener
   */
  public addViewMoveListener(listener: () => void) {
    this.internalMap.on('moveend', listener);
  }

  public removeViewMoveListener(listener: () => void) {
    this.internalMap.un('moveend', listener);
  }

  public setDefaultLayers(): void {
    this.internalMap.getLayers().clear();
    const osm = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    this.addLayer(osm);

    const vector = LayerFactory.newVectorLayer();
    this.addLayer(vector);
    this.setActiveLayer(vector);
  }

  public addLayer(layer: LayerWrapper, position?: number): void {
    const olLayer = layer.unwrap();
    if (typeof position !== 'undefined') {
      this.internalMap.getLayers().insertAt(position, olLayer);
    } else {
      this.internalMap.addLayer(olLayer);
    }

    if (olLayer instanceof TileLayer) {
      olLayer.getSource()?.on('tileloaderror', this.handleTileLoadError);
    }
  }

  /**
   * Clear layers from this mapn, shallow clone other's layers and add them to this map.
   */
  public importLayersFrom(other: MapWrapper, options?: Partial<StyleFactoryOptions>) {
    this.unwrap().getLayers().clear();
    other.getLayers().forEach((layer) => this.addLayer(layer.shallowClone(options)));
  }

  /**
   * Return layers managed layers
   */
  public getLayers(): LayerWrapper[] {
    return this.internalMap
      .getLayers()
      .getArray()
      .filter((lay) => LayerWrapper.isManaged(lay))
      .map((lay) => LayerWrapper.from(lay as OlLayers));
  }

  public setActiveLayer(layer: LayerWrapper): void {
    const layers = this.getLayers();

    // We check if layer belong to map
    const foundInMap = layers.find((lay) => lay.getId() === layer.getId());
    if (!foundInMap) {
      throw new Error('Layer does not belong to map');
    }

    // We set layer active, we set others not active
    layers.forEach((lay) => lay.setActive(lay.getId() === layer.getId()));

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
    this.internalMap.getLayers().remove(olLayer);

    if (olLayer instanceof TileLayer) {
      olLayer.getSource()?.un('tileloaderror', this.handleTileLoadError);
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
      name: this.internalMap.getView().getProjection().getCode(),
    };
  }

  public addLayerChangeListener(handler: LayerChangeHandler) {
    this.internalMap.getLayers().on('propertychange', handler);
  }

  public removeLayerChangeListener(handler: LayerChangeHandler) {
    this.internalMap.getLayers().un('propertychange', handler);
  }

  /**
   * Get current map tool, may be undefined
   */
  public getTool(): Tool | undefined {
    return this.internalMap.get(ToolProperty);
  }

  /**
   * Set current map tool then dispatch event
   *
   * For the moment tools are supposed to work with vector layers. So if active layer is not a vector layer, we setup MoveMapTool instead.
   */
  public setTool(tool: Tool): void {
    this.getTool()?.dispose();

    const vectorLayer = this.getActiveVectorLayer();
    if (!vectorLayer) {
      this.setDefaultTool();
      return;
    }

    this.internalMap.set(ToolProperty, tool);
    tool.setup(this.internalMap, vectorLayer.getSource());
    this.setToolMode(tool.getModes().length ? tool.getModes()[0] : undefined);
  }

  /**
   * Reset tool state and setup default tool: MoveMapTool
   */
  public setDefaultTool() {
    // Dispose current tool
    this.getTool()?.dispose();

    const interactions = this.internalMap.getInteractions().getArray().slice();
    interactions.forEach((i) => {
      i.dispose();
      this.internalMap.removeInteraction(i);
    });

    // Setup Move Map tool
    const tool = new MoveMapTool();
    tool.setup(this.internalMap);
    this.internalMap.set(ToolProperty, tool);

    // Set mode and dispatch
    this.setToolMode(undefined);
  }

  /**
   * Set current tool mode then dispatch event
   */
  public setToolMode(toolMode: ToolMode | undefined): void {
    ToolModeHelper.set(this.internalMap, toolMode);

    const tool = this.getTool();
    toolMode && tool?.modeChanged && tool.modeChanged(toolMode);

    this.internalMap.dispatchEvent(ToolChangedEvent);
  }

  public getToolMode(): ToolMode | undefined {
    return ToolModeHelper.get(this.internalMap);
  }

  public addToolListener(listener: ToolChangedHandler): void {
    // Typings are borked
    this.internalMap.on(ToolChangedEvent as any, listener);
  }

  public removeToolListener(listener: ToolChangedHandler): void {
    // Typings are borked
    this.internalMap.un(ToolChangedEvent as any, listener);
  }

  /**
   * When body size change, we must keep the largest value for style ratio.
   */
  private updateMainSizeReference = () => {
    const width = document.body.clientWidth || 1700;
    const height = (document.body.clientHeight || 850) - 4 * getRemSize();

    if (this.mainReferenceSize.width < width) {
      this.mainReferenceSize.width = width;
    }

    if (this.mainReferenceSize.height < height) {
      this.mainReferenceSize.height = height;
    }
  };

  /**
   * If user select a raster layer, we must disable tools
   */
  private handleLayerChange = () => {
    const vectorLayer = this.getActiveVectorLayer();
    if (!vectorLayer) {
      this.setDefaultTool();
    }
  };

  public getSizeObserver(): ResizeObserver | undefined {
    return this.mapSizeObserver;
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
    this.internalMap.getLayers().set(LayerProperties.LastLayerChange, performance.now());
  }

  /**
   * Move to specified extent. Extent numbers are: minX, minY, maxX, maxY.
   *
   * Source projection is assumed EPSG4326
   */
  public moveViewToExtent(extent: Extent, sourceProjection?: AbcProjection, duration = 1500): void {
    const _sourceProj = sourceProjection || EPSG_4326;
    const _extent = transformExtent(extent, _sourceProj.name, this.getView().projection.name);

    const view = this.internalMap.getView();
    view.fit(_extent, { duration });
  }

  /**
   * Source projection is assumed EPSG4326
   */
  public moveViewToPosition(coords: Coordinate, zoom: number): void {
    const view = this.internalMap.getView();
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
    this.internalMap.setView(Views.abcToOl(view));
  }

  public getView(): AbcView {
    return Views.olToAbc(this.internalMap.getView());
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

  /**
   * Get a ratio that can be used to display style proportional to the main editing map.
   *
   * @param otherWidthPx
   * @param otherHeightPx
   */
  public getMainRatio(otherWidthPx: number, otherHeightPx: number): number {
    const { width, height } = this.mainReferenceSize;
    if (!width || !height) {
      throw new Error('Invalid reference size');
    }

    const referenceDiag = Math.sqrt(width ** 2 + height ** 2);
    const otherDiag = Math.sqrt(otherWidthPx ** 2 + otherHeightPx ** 2);

    return toPrecision(otherDiag / referenceDiag, 5);
  }

  public getTarget(): HTMLDivElement | undefined {
    return this.internalMap.getTarget() as HTMLDivElement | undefined;
  }

  public getRatioWith(otherWidthPx: number, otherHeightPx: number): number {
    const target = this.internalMap.getTarget() as HTMLDivElement | undefined;
    if (!target) {
      throw new Error('Invalid map target');
    }

    const mapDiag = Math.sqrt(target.clientWidth ** 2 + target.clientHeight ** 2);
    const otherDiag = Math.sqrt(otherWidthPx ** 2 + otherHeightPx ** 2);

    return toPrecision(otherDiag / mapDiag, 5);
  }

  public getMainReferenceSize(): DimensionsPx {
    return this.mainReferenceSize;
  }

  private handleSizeChange = () => {
    // Each time support size change, we update map
    this.internalMap.updateSize();

    // Then we notify listeners
    const target = this.internalMap.getTarget();
    if (!target || !(target instanceof HTMLDivElement)) {
      logger.error('Invalid target, size event will not be dispatched');
      return;
    }

    // We keep the largest size for style ratio
    const width = target.clientWidth;
    const height = target.clientHeight;
    this.eventTarget.dispatchEvent(new MapSizeChangedEvent({ width, height }));
  };

  private handleTileLoadError = (ev: BaseEvent) => {
    if (!(ev.target instanceof TileSource)) {
      logger.error('Unhandled event target: ', ev);
      return true;
    }

    const layer = this.internalMap
      .getLayers()
      .getArray()
      .find((lay) => lay instanceof TileLayer && lay.getSource() === ev.target) as TileLayer<TileSource> | undefined;

    if (layer) {
      this.eventTarget.dispatchEvent(new TileLoadErrorEvent(LayerWrapper.from(layer)));
    }

    return true;
  };

  public unwrap(): Map {
    return this.internalMap;
  }
}
