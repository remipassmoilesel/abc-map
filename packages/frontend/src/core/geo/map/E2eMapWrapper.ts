import { MapWrapper } from './MapWrapper';
import { Logger, E2eMap } from '@abc-map/frontend-commons';
import { LayerMetadata, BaseMetadata } from '@abc-map/shared-entities';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

export const logger = Logger.get('E2eMapWrapper.ts', 'debug');

/**
 * This class wrap managed maps to offer an interface for E2E tests.
 *
 * OK this is a bit hacky, but:
 * - it worth it, in order to get tests for complex scenarios like drawing
 * - it is type safe
 * - it is cheap
 */
export class E2eMapWrapper implements E2eMap {
  constructor(private readonly internal: MapWrapper) {}

  public getLayersMetadata(): LayerMetadata[] {
    return this.internal
      .getLayers()
      .map((lay) => lay.getMetadata())
      .filter((meta) => !!meta) as LayerMetadata[];
  }

  public getActiveLayerMetadata(): BaseMetadata | undefined {
    const layer = this.internal.getActiveLayer();
    if (!layer) {
      return;
    }

    return layer.getMetadata();
  }

  public getActiveLayerFeatures(): Feature<Geometry>[] {
    const layer = this.internal.getActiveVectorLayer();
    if (!layer) {
      return [];
    }

    return layer.getSource().getFeatures();
  }

  public getViewExtent() {
    return this.internal.unwrap().getView().calculateExtent();
  }

  public getInternal(): MapWrapper {
    return this.internal;
  }
}
