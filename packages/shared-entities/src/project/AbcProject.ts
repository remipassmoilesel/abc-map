import { AbcLayer } from './AbcLayer';
import { AbcLayout } from './AbcLayout';
import { AbcProjection } from './AbcProjection';

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
