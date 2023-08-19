/**
 * Copyright © 2023 Rémi Pace.
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

import { getLength, getArea } from 'ol/sphere';
import { AbcProjection } from '@abc-map/shared';
import Geometry from 'ol/geom/Geometry';
import { getNumberFormatter } from '../../../../i18n/i18n';

export function formatLength(geometry: Geometry, projection?: AbcProjection): string {
  const length = getLength(geometry, { projection: projection?.name });
  const formatter = getNumberFormatter();

  let output;
  if (length > 100) {
    output = `${formatter.format(Math.round((length / 1000) * 100) / 100)} km`;
  } else {
    output = `${formatter.format(Math.round(length * 100) / 100)} m`;
  }
  return output;
}

export function formatArea(geometry: Geometry, projection?: AbcProjection): string {
  const area = getArea(geometry, { projection: projection?.name });
  const formatter = getNumberFormatter();

  let output;
  if (area > 10000) {
    output = `${formatter.format(Math.round((area / 1000000) * 100) / 100)} km²`;
  } else {
    output = `${formatter.format(Math.round(area * 100) / 100)} m²`;
  }
  return output;
}
