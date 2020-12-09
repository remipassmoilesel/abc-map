import { FeatureCollection } from 'geojson';

export interface AbcProject {
  id: string;
  name: string;
  projection: AbcProjection;
  view: AbcView;
  layers: AbcLayer[];
  createdAt: string;
}

export interface AbcProjection {
  name: string;
}

export const DEFAULT_PROJECTION: AbcProjection = {
  name: 'EPSG:3857',
};

export interface AbcView {
  center: [number, number];
  resolution: number;
  rotation: number;
  minResolution: number;
  maxResolution: number;
}

export enum LayerType {
  Vector = 'Vector',
  Predefined = 'PREDEFINED',
}

export interface AbcLayerMetadata {
  id: string;
  name: string;
  type: LayerType;
  opacity: number;
  visible: boolean;
}

export interface AbcBaseLayer {
  metadata: AbcLayerMetadata;
}

export interface AbcVectorLayer extends AbcBaseLayer {
  features: FeatureCollection;
}

export enum PredefinedLayerModel {
  OSM = 'OSM',
}

export interface AbcPredefinedLayer extends AbcBaseLayer {
  type: LayerType.Predefined;
  model: PredefinedLayerModel;
}

export type AbcLayer = AbcVectorLayer | AbcPredefinedLayer;
