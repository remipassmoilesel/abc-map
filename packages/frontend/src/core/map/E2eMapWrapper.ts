import { ManagedMap } from './ManagedMap';
import { Logger } from '../utils/Logger';
import { LayerFactory } from './LayerFactory';
import { AbcLayerMetadata, E2eFeature, E2eMap } from '@abc-map/shared-entities';

export const logger = Logger.get('E2eMapWrapper.ts', 'debug');

/**
 * This class wrap managed maps to offer an interface for E2E tests.
 *
 * OK this is a bit hacky, but:
 * - it worth it, in order to get a good coverage for complex scenarios like drawing
 * - it is type safe
 * - it is cheap
 */
export class E2eMapWrapper implements E2eMap {
  constructor(private readonly internal: ManagedMap) {}

  public getLayersMetadata(): AbcLayerMetadata[] {
    return this.internal
      .getLayers()
      .map((lay) => LayerFactory.getMetadataFromLayer(lay))
      .filter((meta) => !!meta) as AbcLayerMetadata[];
  }

  public getActiveLayerFeatures(): E2eFeature[] {
    const layer = this.internal.getActiveVectorLayer();
    if (!layer) {
      return [];
    }

    return layer.getSource().getFeatures();
  }
}
