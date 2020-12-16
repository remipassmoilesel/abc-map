import { AbcLayer } from './layer';
import { AbcLayout } from './layout';

export interface AbcProject {
  metadata: AbcProjectMetadata;
  layers: AbcLayer[];
  layouts: AbcLayout[];
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
