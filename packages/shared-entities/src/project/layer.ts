import { FeatureCollection } from 'geojson';

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
