import { AbcProjection } from '@abc-map/shared-entities';
import { AbcFile } from '@abc-map/frontend-shared';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';

export abstract class AbstractDataReader {
  public abstract isSupported(files: AbcFile[]): Promise<boolean>;
  public abstract read(files: AbcFile[], projection: AbcProjection): Promise<LayerWrapper[]>;

  /**
   * This methods add an id if absent and set default style
   * @param features
   * @protected
   */
  protected prepareFeatures(features: Feature<Geometry>[]) {
    features.forEach((feat) => {
      const feature = FeatureWrapper.from(feat);
      if (!feature.getId()) {
        feature.setId();
      }

      feature.setDefaultStyle();
    });
  }
}
