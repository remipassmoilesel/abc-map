import { AbcProjection } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import { AbcFile } from './AbcFile';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { FeatureHelper } from '../geo/features/FeatureHelper';

export abstract class AbstractDataReader {
  public abstract isSupported(files: AbcFile[]): Promise<boolean>;
  public abstract read(files: AbcFile[], projection: AbcProjection): Promise<BaseLayer[]>;

  protected generateIdsIfAbsents(features: Feature<Geometry>[]) {
    features.forEach((feature) => {
      if (!feature.getId()) {
        FeatureHelper.setId(feature);
      }
    });
  }
}
