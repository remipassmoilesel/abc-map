import { FeatureCollection } from 'geojson';

export interface AbcProject {
  id: string;
  name: string;
  projection: AbcProjection;
  layers: AbcLayer[];
}

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
