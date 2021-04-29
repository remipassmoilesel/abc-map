import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import { FeatureWrapper } from '../../features/FeatureWrapper';

export function toleranceFromStyle(feature: Feature<Geometry>, resolution: number): number {
  const styleProps = FeatureWrapper.from(feature).getStyleProperties();
  const pointSize = (styleProps.point?.size || 0) / 2;
  const strokeWidth = (styleProps.stroke?.width || 0) / 2;
  return (pointSize + strokeWidth) * resolution;
}
