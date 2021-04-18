import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';

const tolerancePx = 7;

/**
 * Find a feature under cursor if any, or near cursor.
 *
 * We must seek features around cursor for 'thin' geometries like points or lines.
 *
 * @param event
 * @param source
 */
export function findFeatureUnderCursor(event: MapBrowserEvent<UIEvent>, source: VectorSource): Feature<Geometry> | undefined {
  const coord = event.coordinate;

  // First we try to find a feature on coordinates
  const features = source.getFeaturesAtCoordinate(coord);
  if (features.length) {
    return features[0];
  }

  // If nothing found, we try to find a feature close to coordinates
  const resolution = event.map.getView().getResolution() || 1;
  const tolerance = tolerancePx * resolution;
  const feature = source.getClosestFeatureToCoordinate(coord) as Feature<Geometry> | undefined; // getClosestFeatureToCoordinate typing is borked
  const closestPoint = feature?.getGeometry()?.getClosestPoint(coord);
  if (!closestPoint) {
    return;
  }

  const closeTo = Math.abs(closestPoint[0] - coord[0]) <= tolerance && Math.abs(closestPoint[1] - coord[1]) <= tolerance;
  return (closeTo && feature) || undefined;
}
