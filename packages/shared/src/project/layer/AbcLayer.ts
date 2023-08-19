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

import { FeatureCollection } from 'geojson';
import { AbcProjection } from '../projection/AbcProjection';
import { LayerAuthentication } from './LayerAuthentication';

export type AbcLayer = AbcVectorLayer | AbcPredefinedLayer | AbcWmsLayer | AbcWmtsLayer | AbcXyzLayer;

export type LayerMetadata = VectorMetadata | PredefinedMetadata | WmsMetadata | WmtsMetadata | XyzMetadata;

export enum LayerType {
  Vector = 'Vector',
  Predefined = 'Predefined',
  Wms = 'Wms',
  Wmts = 'Wmts',
  Xyz = 'Xyz',
}

// Base types

export interface AbcBaseLayer {
  type: LayerType;
  metadata: LayerMetadata;
}

export interface BaseMetadata {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  active: boolean;
  type: LayerType;
  /**
   * Users can add a custom attribution to a layer (for exports).
   * But they can not modify existing ones (like OSM attributions).
   */
  attributions?: string[];
}

// Vector layer

export interface VectorMetadata extends BaseMetadata {
  type: LayerType.Vector;
}

export interface AbcVectorLayer extends AbcBaseLayer {
  type: LayerType.Vector;
  metadata: VectorMetadata;
  features: FeatureCollection;
}

// Predefined layers

export interface PredefinedMetadata extends BaseMetadata {
  type: LayerType.Predefined;
  model: PredefinedLayerModel;
}

export interface AbcPredefinedLayer extends AbcBaseLayer {
  type: LayerType.Predefined;
  metadata: PredefinedMetadata;
}

export enum PredefinedLayerModel {
  OSM = 'OSM',
  StamenToner = 'StamenToner',
  StamenTonerLite = 'StamenTonerLite',
  StamenTerrain = 'StamenTerrain',
  StamenWatercolor = 'StamenWatercolor',
}

// WMS

export interface WmsMetadata extends BaseMetadata {
  type: LayerType.Wms;
  projection?: AbcProjection;
  extent?: [number, number, number, number];
  remoteUrls: string[];
  remoteLayerName: string;
  auth?: LayerAuthentication;
}

export interface AbcWmsLayer extends AbcBaseLayer {
  type: LayerType.Wms;
  metadata: WmsMetadata;
}

// WMTS

export interface WmtsMetadata extends BaseMetadata {
  type: LayerType.Wmts;
  capabilitiesUrl: string;
  remoteLayerName: string;
  auth?: LayerAuthentication;
}

export interface AbcWmtsLayer extends AbcBaseLayer {
  type: LayerType.Wmts;
  metadata: WmtsMetadata;
}

// XYZ

export interface XyzMetadata extends BaseMetadata {
  type: LayerType.Xyz;
  projection?: AbcProjection;
  remoteUrl: string;
}

export interface AbcXyzLayer extends AbcBaseLayer {
  type: LayerType.Xyz;
  metadata: XyzMetadata;
}
