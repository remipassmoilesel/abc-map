import { AbcProjectMetadata } from '@abc-map/shared-entities';

/**
 * This interface is duplicated in backend
 */
export interface CompressedProject {
  metadata: AbcProjectMetadata;
  project: Blob;
}
