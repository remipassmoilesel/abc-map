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

import { asNumberOrString, isNumeric, toPrecision } from './numbers';

describe('numbers', () => {
  it('isNumeric()', () => {
    expect(isNumeric('1')).toBeTruthy();
    expect(isNumeric('1.1')).toBeTruthy();
    expect(isNumeric('001')).toBeTruthy();
    expect(isNumeric('abcdef')).toBeFalsy();
  });

  it('asNumberOrString()', () => {
    expect(asNumberOrString(1)).toEqual(1);
    expect(asNumberOrString('1')).toEqual(1);
    expect(asNumberOrString('1,1')).toEqual(1.1);
    expect(asNumberOrString('1.1')).toEqual(1.1);
    expect(asNumberOrString('001')).toEqual(1);
    expect(asNumberOrString('abcdef')).toEqual('abcdef');
    expect(asNumberOrString('abc,def')).toEqual('abc,def');
  });

  it('toPrecision()', () => {
    expect(toPrecision(1, 4)).toEqual(1);
    expect(toPrecision(1.00001, 4)).toEqual(1);
    expect(toPrecision(1.77778, 4)).toEqual(1.7778);
  });
});
