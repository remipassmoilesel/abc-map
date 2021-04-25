import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import { FeatureWrapper } from '../../features/FeatureWrapper';

const defaultTolerancePx = 5;

export declare type FeatureFilter = (f: Feature<Geometry>) => boolean;
export const noopFilter: FeatureFilter = () => true;

/**
 * Find a feature under cursor if any, or near cursor.
 *
 * We must seek features around cursor for 'thin' geometries like points or lines.
 *
 * /!\ Vector source parameter must have useSpatialIndex option enabled
 *
 */
export function findFeatureNearCursor(
  event: MapBrowserEvent<UIEvent>,
  source: VectorSource,
  filter = noopFilter,
  tolerancePx = defaultTolerancePx
): Feature<Geometry> | undefined {
  const coord = event.coordinate;

  // First we try to find a feature on coordinates
  const features = source.getFeaturesAtCoordinate(coord).filter(filter);
  if (features.length) {
    return features[0];
  }

  // If nothing found, we try to find a feature close to coordinates
  const feature = source.getClosestFeatureToCoordinate(coord) as Feature<Geometry> | undefined; // getClosestFeatureToCoordinate typing is borked
  const closestPoint = feature?.getGeometry()?.getClosestPoint(coord);
  if (!feature || !closestPoint) {
    return;
  }

  const resolution = event.map.getView().getResolution() || 1;
  const styleProps = FeatureWrapper.from(feature).getStyleProperties();
  const pointSize = (styleProps.point?.size || 0) / 2;
  const strokeWidth = (styleProps.stroke?.width || 0) / 2;
  const tolerance = (tolerancePx + pointSize + strokeWidth) * resolution;

  const matchFilter = feature && filter(feature);
  const closeTo = Math.abs(closestPoint[0] - coord[0]) <= tolerance && Math.abs(closestPoint[1] - coord[1]) <= tolerance;
  return (matchFilter && closeTo && feature) || undefined;
}
