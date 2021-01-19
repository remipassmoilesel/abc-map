import { BaseMetadata, LayerMetadata } from '../project';

export interface E2eMap {
  getLayersMetadata(): LayerMetadata[];

  getActiveLayerMetadata(): BaseMetadata | undefined;

  getActiveLayerFeatures(): E2eFeature[];
}

export interface E2eFeature {
  getGeometryName(): string;
  getGeometry(): E2eGeometry | undefined;
  getProperties(): { [key: string]: any };
  get(k: string): any;
}

export interface E2eGeometry {
  getType(): GeometryType;
  getExtent(): [number, number, number, number];
}

export type GeometryType =
  | 'Point'
  | 'LineString'
  | 'LinearRing'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon'
  | 'GeometryCollection'
  | 'Circle';
