import { FeatureWrapper } from '../../features/FeatureWrapper';
import VectorSource from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';

export function unselectAll(source: VectorSource): void {
  source.forEachFeature((f) => {
    const feat = FeatureWrapper.from(f);
    if (feat.isSelected()) {
      feat.setSelected(false);
    }
  });
}

export function getSelected(source: VectorSource): Feature<Geometry>[] {
  return source.getFeatures().filter((f) => {
    const feat = FeatureWrapper.from(f);
    return feat.isSelected();
  });
}
