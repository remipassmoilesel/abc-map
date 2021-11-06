/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import { toleranceFromStyle } from './toleranceFromStyle';
import { isCloseTo } from './isCloseTo';
import { DefaultTolerancePx } from './constants';

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
  event: MapBrowserEvent,
  source: VectorSource,
  filter = noopFilter,
  tolerancePx = DefaultTolerancePx
): Feature<Geometry> | undefined {
  const coord = event.coordinate;

  // First we try to find a feature on coordinates
  const features = source.getFeaturesAtCoordinate(coord).filter(filter);
  if (features.length) {
    return features[0];
  }

  // If nothing found, we try to find a feature close to coordinates
  // This code allow user to select small points
  const feature = source.getClosestFeatureToCoordinate(coord) as Feature<Geometry> | undefined; // getClosestFeatureToCoordinate typing is borked
  const closestPoint = feature?.getGeometry()?.getClosestPoint(coord);
  if (!feature || !closestPoint) {
    return;
  }

  const resolution = event.map.getView().getResolution() || 1;
  const tolerance = toleranceFromStyle(feature, resolution) + tolerancePx * resolution;

  const matchFilter = feature && filter(feature);
  const closeTo = isCloseTo(closestPoint, coord, tolerance);
  return (matchFilter && closeTo && feature) || undefined;
}
