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

import { linkify, prettyStringify } from './strings';

describe('strings', () => {
  it('prettyStringify()', () => {
    expect(prettyStringify(null)).toEqual('Valeur non définie');
    expect(prettyStringify(undefined)).toEqual('Valeur non définie');
    expect(prettyStringify({})).toEqual('{}');
    expect(prettyStringify('')).toEqual('""');
    expect(prettyStringify(0)).toEqual('0');
    expect(prettyStringify(11)).toEqual('11');
    expect(prettyStringify([])).toEqual('[]');
  });

  it('linkify()', () => {
    expect(linkify('Hello')).toEqual('Hello');
    expect(linkify('Hello click here: https://somewhere.net/section?q1=p1&q2=p2')).toEqual(
      'Hello click here: <a href="https://somewhere.net/section?q1=p1&q2=p2" target="_blank">https://somewhere.net/section?q1=p1&q2=p2</a>'
    );
    expect(linkify('Hello mail me here: somewhere@somebody.net')).toEqual(
      'Hello mail me here: <a href="mailto:somewhere@somebody.net">somewhere@somebody.net</a>'
    );
  });
});
