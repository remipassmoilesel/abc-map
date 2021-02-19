import { AbcProjection } from '@abc-map/shared-entities';
import { AbcFile } from './AbcFile';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { FeatureWrapper } from '../geo/features/FeatureWrapper';
import { LayerWrapper } from '../geo/layers/LayerWrapper';

export abstract class AbstractDataReader {
  public abstract isSupported(files: AbcFile[]): Promise<boolean>;
  public abstract read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]>;

  protected generateIdsIfAbsents(features: Feature<Geometry>[]) {
    features.forEach((feat) => {
      const feature = FeatureWrapper.from(feat);
      if (!feature.getId()) {
        feature.setId();
      }
    });
  }
}
