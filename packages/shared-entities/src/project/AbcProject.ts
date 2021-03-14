import { AbcLayer } from './AbcLayer';
import { AbcLayout } from './AbcLayout';
import { AbcProjection } from './AbcProjection';

/**
 * Version of project, not used for the moment but will be useful for data migrations
 */
export const CurrentVersion = '0.1';

/**
 * Name of main data file in project archive
 */
export const ManifestName = 'project.json';

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
  containsCredentials: boolean;
}
