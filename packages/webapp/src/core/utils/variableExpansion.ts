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

/* eslint-disable no-template-curly-in-string */

import { DateTime } from 'luxon';

export type VariableMap = { [k: string]: string | number | undefined };

export function variableExpansion(source: string, variables: VariableMap): string {
  const keys = Object.keys(variables);
  let result = source;
  for (const key of keys) {
    const value = `${variables[key]}`;
    result = result.replace(new RegExp('\\${' + key + '}', 'ig'), value);
  }

  return result;
}

export function attributionsVariableExpansion(attrs: string[]): string[] {
  const variables = { year: DateTime.local().year };
  return attrs.map((s) => variableExpansion(s, variables));
}
