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

export interface AbcProjection {
  name: string;
}

export const DEFAULT_PROJECTION: AbcProjection = {
  name: 'EPSG:3857',
};

/**
 * This function extract a valid projection name from string if any.
 *
 * It supports only CRS:## EPSG:## codes.
 *
 * @param projection
 */
export function normalizedProjectionName(projection: string): string | undefined {
  const code = projection
    .toLocaleUpperCase()
    .trim()
    .match(/(EPSG|CRS)[:]+([0-9]+)/i);

  if (code && code.length && code[1] && code[2]) {
    return `${code[1]}:${code[2]}`;
  }
}

export function projectionCodeFromName(projection: string): string | undefined {
  return normalizedProjectionName(projection)?.split(':')[1] || undefined;
}

/**
 * Return true if projection names can be normalized and are equals
 *
 * @param projectionA
 * @param projectionB
 */
export function isProjectionEqual(projectionA: string, projectionB: string): boolean {
  const a = normalizedProjectionName(projectionA);
  const b = normalizedProjectionName(projectionB);
  return (typeof a !== 'undefined' || typeof b !== 'undefined') && a === b;
}
