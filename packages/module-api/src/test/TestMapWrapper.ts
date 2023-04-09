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

import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { AbcProjection } from '../map/AbcProjection';
import { FeatureCallback, LayerChangeHandler, MapWrapper } from '../map/MapWrapper';
import { AbcView } from '../map/AbcView';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { FeatureWrapper } from '../features';
import { LayerWrapper, VectorLayerWrapper } from '../layers';

/**
 * Initialize a new map wrapper stub. Based on sinonjs, see: https://sinonjs.org/releases/latest/stubs/
 */
export function newTestMapWrapper(): SinonStubbedInstance<MapWrapper> {
  return sinon.createStubInstance(DumbMapWrapper);
}

/* eslint-disable */
class DumbMapWrapper implements MapWrapper {
  addLayer(layer: LayerWrapper, position?: number): void {}

  addLayerChangeListener(handler: LayerChangeHandler): void {}

  addViewMoveListener(listener: () => void): void {}

  dispose(): void {}

  forEachFeatureSelected(callback: FeatureCallback): number {
    return {} as any;
  }

  getActiveLayer(): LayerWrapper | undefined {
    return {} as any;
  }

  getActiveVectorLayer(): VectorLayerWrapper | undefined {
    return {} as any;
  }

  getLayers(): LayerWrapper[] {
    return {} as any;
  }

  getProjection(): AbcProjection {
    return {} as any;
  }

  getSelectedFeatures(): FeatureWrapper[] {
    return {} as any;
  }

  getTarget(): HTMLDivElement | undefined {
    return {} as any;
  }

  getTextAttributions(): string[] {
    return {} as any;
  }

  getView(): AbcView {
    return {} as any;
  }

  importLayersFrom(other: MapWrapper, options?: any): void {}

  moveViewToExtent(extent: Extent, sourceProjection?: AbcProjection, duration?: number): void {}

  moveViewToPosition(coords: Coordinate, zoom: number): void {}

  removeLayer(layer: LayerWrapper): void {}

  removeLayerChangeListener(handler: LayerChangeHandler): void {}

  removeViewMoveListener(listener: () => void): void {}

  renameLayer(layer: LayerWrapper, name: string): void {}

  setActiveLayer(layer: LayerWrapper): void {}

  setDefaultLayers(): void {}

  setLayerVisible(layer: LayerWrapper, value: boolean): void {}

  setTarget(node: HTMLDivElement | undefined): void {}

  setView(view: AbcView): void {}
}
/* eslint-enable */
