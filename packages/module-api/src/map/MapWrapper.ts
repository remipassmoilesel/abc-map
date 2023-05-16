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

import BaseEvent from 'ol/events/Event';
import { FeatureWrapper } from '../features/FeatureWrapper';
import { LayerWrapper, VectorLayerWrapper } from '../layers/LayerWrapper';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import { AbcProjection } from './AbcProjection';
import { AbcView } from './AbcView';

export declare type LayerChangeHandler = (ev: BaseEvent) => void;
export declare type FeatureCallback = (feat: FeatureWrapper, layer: VectorLayerWrapper) => void;

/**
 * MapWrapper wraps Openlayers maps, mainly for Abc-Map specific critical operations (layer selection, view management, ...)
 *
 * The goal is not to replace the use of Openlayers maps, but to extend them by composition.
 *
 * Call unwrap() to access the underlying map.
 */
export interface MapWrapper {
  dispose(): void;
  addViewMoveListener(listener: () => void): void;
  removeViewMoveListener(listener: () => void): void;
  addLayer(layer: LayerWrapper, position?: number): void;
  importLayersFrom(other: MapWrapper, options?: any): void;
  getLayers(): LayerWrapper[];
  setActiveLayer(layer: LayerWrapper | undefined): void;
  renameLayer(layer: LayerWrapper, name: string): void;
  getActiveLayer(): LayerWrapper | undefined;
  removeLayer(layer: LayerWrapper): void;
  getActiveVectorLayer(): VectorLayerWrapper | undefined;
  forEachFeatureSelected(callback: FeatureCallback): number;
  getSelectedFeatures(): FeatureWrapper[];
  getProjection(): AbcProjection;
  addLayerChangeListener(handler: LayerChangeHandler): void;
  removeLayerChangeListener(handler: LayerChangeHandler): void;
  setLayerVisible(layer: LayerWrapper, value: boolean): void;
  moveViewToExtent(extent: Extent, sourceProjection?: AbcProjection, duration?: number): void;
  moveViewToPosition(coords: Coordinate, zoom: number): void;
  setView(view: AbcView): void;
  getView(): AbcView;
  getTarget(): HTMLDivElement | undefined;
  setTarget(node: HTMLDivElement | undefined): void;
}
