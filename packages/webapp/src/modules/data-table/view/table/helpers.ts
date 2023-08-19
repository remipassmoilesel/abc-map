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

import { DataRow } from '../../../../core/data/data-source/DataSource';
import { asNumberOrString } from '../../../../core/utils/numbers';
import { getRemSize } from '../../../../core/ui/getRemSize';
import { getTextWidth } from '../../../../core/ui/getTextWidth';

// Computes column sizes depending on larger values
export function getAllColumSizes(rows: DataRow[]): { [k: string]: number } {
  // k: fieldName, v: maximum length as string
  const result: { [k: string]: number } = {};
  for (const row of rows) {
    for (const field in row.data) {
      let value = asNumberOrString(row.data[field]) + '';
      // If value is shorter than field name, we use field name as base
      if (!value || value.length < field.length) {
        value = field;
      }

      // We keep only the higher value
      result[field] = Math.max(getColumnSize(value), result[field] || 0);
    }
  }

  return result;
}

export function getColumnSize(value: string | number) {
  const remSize = getRemSize();
  const filterIconSize = 2 * remSize;
  const margins = 3.5 * remSize;

  return Math.round(Math.max(getTextWidth(value + '') + filterIconSize + margins));
}
