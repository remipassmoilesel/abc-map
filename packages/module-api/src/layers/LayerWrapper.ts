/**
 * Copyright © 2023 Rémi Pace.
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

import TileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Source, TileWMS, WMTS, XYZ } from 'ol/source';
import { Layer } from 'ol/layer';
import LayerRenderer from 'ol/renderer/Layer';
import { AbcProjection } from '../map/AbcProjection';

export type OlLayers = Layer<Source, LayerRenderer<any>> | VectorImageLayer<VectorSource<Geometry>> | TileLayer<TileSource>;
export type OlSources = Source | VectorSource<Geometry> | TileSource | TileWMS | WMTS;

export type VectorLayerWrapper = LayerWrapper<VectorImageLayer<VectorSource<Geometry>>, VectorSource<Geometry>>;
export type PredefinedLayerWrapper = LayerWrapper<TileLayer<TileSource>, TileSource>;
export type WmsLayerWrapper = LayerWrapper<TileLayer<TileSource>, TileWMS>;
export type WmtsLayerWrapper = LayerWrapper<TileLayer<TileSource>, WMTS>;
export type XyzLayerWrapper = LayerWrapper<TileLayer<TileSource>, XYZ>;

export type Meta = { [k: string]: any };

/**
 * LayerWrapper wraps Openlayers layers, mainly for Abc-Map specific critical operations (selection, naming, ...)
 *
 * The goal is not to replace the use of Openlayers layers, but to extend them by composition.
 *
 * Call unwrap() to access the underlying layer.
 */
export interface LayerWrapper<Layer extends OlLayers = OlLayers, Source extends OlSources = OlSources> {
  unwrap(): Layer;
  getSource(): Source;
  setId(value?: string): LayerWrapper;
  getId(): string | undefined;
  setName(value: string): LayerWrapper;
  getName(): string | undefined;
  setActive(value: boolean): LayerWrapper;
  isActive(): boolean;
  setVisible(value: boolean): LayerWrapper;
  isVisible(): boolean;
  setOpacity(value: number): LayerWrapper;
  getOpacity(): number;
  getType(): LayerType | undefined;
  isPredefined(): this is PredefinedLayerWrapper;
  isVector(): this is VectorLayerWrapper;
  isWms(): this is WmsLayerWrapper;
  isWmts(): this is WmtsLayerWrapper;
  isXyz(): this is XyzLayerWrapper;
  getAttributions(format: AttributionFormat): string[] | undefined;
  setAttributions(attr: string[]): LayerWrapper<Layer, Source>;
  getProjection(): AbcProjection | undefined;
}

export enum LayerType {
  Vector = 'Vector',
  Predefined = 'Predefined',
  Wms = 'Wms',
  Wmts = 'Wmts',
  Xyz = 'Xyz',
}

export enum AttributionFormat {
  Text = 'Text',
  HTML = 'HTML',
}
