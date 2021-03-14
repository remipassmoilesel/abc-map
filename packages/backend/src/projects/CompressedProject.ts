import { AbcProjectMetadata } from '@abc-map/shared-entities';

/**
 * * This interface is duplicated in frontend
 */
export interface CompressedProject {
  metadata: AbcProjectMetadata;
  project: Buffer;
}
