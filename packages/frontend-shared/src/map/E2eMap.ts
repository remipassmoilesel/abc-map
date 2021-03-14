import { BaseMetadata, LayerMetadata } from '@abc-map/shared-entities';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';

export interface E2eMap {
  getLayersMetadata(): LayerMetadata[];

  getActiveLayerMetadata(): BaseMetadata | undefined;

  getActiveLayerFeatures(): Feature<Geometry>[];

  getViewExtent(): [number, number, number, number];
}
