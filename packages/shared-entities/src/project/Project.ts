import { FeatureCollection } from 'geojson';

//
//  WARNING: modifying entities here needs a data migration for the moment
//

export interface AbcProject {
  metadata: AbcProjectMetadata;
  layers: AbcLayer[];
}

export interface AbcProjectMetadata {
  id: string;
  version: string;
  name: string;
  projection: AbcProjection;
}

export const CURRENT_VERSION = '0.1';

export interface AbcProjection {
  name: string;
}

export const DEFAULT_PROJECTION: AbcProjection = {
  name: 'EPSG:3857',
};

export interface AbcBaseLayer {
  type: LayerType;
  metadata: AbcLayerMetadata;
}

export enum LayerType {
  Vector = 'Vector',
  Predefined = 'Predefined',
}

export interface AbcLayerMetadata {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  active: boolean;
  type: LayerType;
}

export interface AbcVectorLayer extends AbcBaseLayer {
  type: LayerType.Vector;
  features: FeatureCollection;
}

export interface AbcPredefinedLayer extends AbcBaseLayer {
  type: LayerType.Predefined;
  model: PredefinedLayerModel;
}

export enum PredefinedLayerModel {
  OSM = 'OSM',
}

export type AbcLayer = AbcVectorLayer | AbcPredefinedLayer;
