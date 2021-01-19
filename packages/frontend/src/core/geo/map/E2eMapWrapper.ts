import { ManagedMap } from './ManagedMap';
import { Logger } from '../../utils/Logger';
import { LayerMetadata, E2eFeature, E2eMap, BaseMetadata } from '@abc-map/shared-entities';
import { LayerMetadataHelper } from './LayerMetadataHelper';

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

  public getLayersMetadata(): LayerMetadata[] {
    return this.internal
      .getLayers()
      .map((lay) => LayerMetadataHelper.getCommons(lay))
      .filter((meta) => !!meta) as LayerMetadata[];
  }

  public getActiveLayerMetadata(): BaseMetadata | undefined {
    const layer = this.internal.getActiveLayer();
    if (!layer) {
      return;
    }

    return LayerMetadataHelper.getCommons(layer);
  }

  public getActiveLayerFeatures(): E2eFeature[] {
    const layer = this.internal.getActiveVectorLayer();
    if (!layer) {
      return [];
    }

    return layer.getSource().getFeatures();
  }

  public getInternal(): ManagedMap {
    return this.internal;
  }
}
