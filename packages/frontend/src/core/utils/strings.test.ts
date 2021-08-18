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

import { prettyStringify } from './strings';

describe('strings', () => {
  it('prettyStringify', () => {
    expect(prettyStringify(null)).toEqual('Valeur non définie');
    expect(prettyStringify(undefined)).toEqual('Valeur non définie');
    expect(prettyStringify({})).toEqual('{}');
    expect(prettyStringify('')).toEqual('""');
    expect(prettyStringify(0)).toEqual('0');
    expect(prettyStringify(11)).toEqual('11');
    expect(prettyStringify([])).toEqual('[]');
  });
});
