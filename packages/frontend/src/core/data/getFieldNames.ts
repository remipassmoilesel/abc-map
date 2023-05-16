/**
 * Copyright © 2022 Rémi Pace.
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

import flow from 'lodash/flow';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import { DataRow } from './data-source/DataSource';

export function getFieldNames(row: DataRow): string[] {
  return Object.keys(row.data);
}

export function getAllFieldNames(rows: DataRow[]): string[] {
  return flow(
    (rows: DataRow[]) => rows.map(getFieldNames),
    (names) => flatMap(names),
    (names) => uniqBy(names, (n) => n),
    (rows) => sortBy(rows)
  )(rows);
}

export function trySelectMainFieldName(fields: string[]): string | undefined {
  const candidates = ['name', 'title', 'label', 'code', 'reference', 'nom', 'titre', 'libell'];

  const exactMatch = candidates.map((fa) => fields.find((fb) => fa === fb.toLocaleLowerCase())).filter((s): s is string => !!s);
  if (exactMatch.length) {
    return exactMatch[0];
  }

  const partialMatch = candidates.map((fa) => fields.find((fb) => fb.match(new RegExp(fa, 'i')))).filter((s): s is string => !!s);
  if (partialMatch.length) {
    return partialMatch[0];
  }

  const firstMatch = fields.find((fa) => !!fa.trim());
  if (firstMatch) {
    return firstMatch;
  }
}
