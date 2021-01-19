import { FeatureCollection } from 'geojson';
import { AbcProjection } from './AbcProjection';

export type AbcLayer = AbcVectorLayer | AbcPredefinedLayer | AbcWmsLayer;

export type LayerMetadata = VectorMetadata | PredefinedMetadata | WmsMetadata;

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
}

export interface VectorMetadata extends BaseMetadata {
  type: LayerType.Vector;
}

export interface PredefinedMetadata extends BaseMetadata {
  type: LayerType.Predefined;
  model: PredefinedLayerModel;
}

export interface WmsMetadata extends BaseMetadata {
  type: LayerType.Wms;
  url: string;
  layerName: string;
  projection?: AbcProjection;
  extent?: [number, number, number, number];
  auth?: {
    username: string;
    password: string;
  };
}

export enum LayerType {
  Vector = 'Vector',
  Predefined = 'Predefined',
  Wms = 'Wms',
}

export interface AbcVectorLayer extends AbcBaseLayer {
  type: LayerType.Vector;
  metadata: VectorMetadata;
  features: FeatureCollection;
}

export interface AbcPredefinedLayer extends AbcBaseLayer {
  type: LayerType.Predefined;
  metadata: PredefinedMetadata;
}

export interface AbcWmsLayer extends AbcBaseLayer {
  type: LayerType.Wms;
  metadata: WmsMetadata;
}

export enum PredefinedLayerModel {
  OSM = 'OSM',
}
