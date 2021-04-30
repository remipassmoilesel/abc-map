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

import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import { FeatureWrapper } from '../../features/FeatureWrapper';

export function toleranceFromStyle(feature: Feature<Geometry>, resolution: number): number {
  const styleProps = FeatureWrapper.from(feature).getStyleProperties();
  const pointSize = (styleProps.point?.size || 0) / 2;
  const strokeWidth = (styleProps.stroke?.width || 0) / 2;
  return (pointSize + strokeWidth) * resolution;
}
