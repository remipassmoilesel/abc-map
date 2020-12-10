import { MongodbDocument } from '../mongodb/MongodbDocument';
import { FeatureCollection } from 'geojson';

export interface ProjectDocument extends MongodbDocument {
  name: string;
  projection: Projection;
  layers: ProjectLayer[];
}

export interface Projection {
  name: string;
}

export interface BaseLayer {
  type: LayerType;
  metadata: LayerMetadata;
}

export enum LayerType {
  Vector = 'Vector',
  Predefined = 'Predefined',
}

export interface LayerMetadata {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
}

export interface VectorLayer extends BaseLayer {
  type: LayerType.Vector;
  features: FeatureCollection;
}

export interface PredefinedLayer extends BaseLayer {
  type: LayerType.Predefined;
  model: PredefinedLayerModel;
}

export enum PredefinedLayerModel {
  OSM = 'OSM',
}

export type ProjectLayer = VectorLayer | PredefinedLayer;
