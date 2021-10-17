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

import { asNumberOrString, isValidNumber, toDegrees, toPrecision, toRadians } from './numbers';

describe('numbers', () => {
  it('isValidNumber()', () => {
    expect(isValidNumber(1)).toBeTruthy();
    expect(isValidNumber('1')).toBeTruthy();
    expect(isValidNumber('1.1')).toBeTruthy();
    expect(isValidNumber('001')).toBeTruthy();

    expect(isValidNumber('')).toBeFalsy();
    expect(isValidNumber('   ')).toBeFalsy();
    expect(isValidNumber('abcdef')).toBeFalsy();
    expect(isValidNumber('1000px')).toBeFalsy();
    expect(isValidNumber(' 10 001')).toBeFalsy();
    expect(isValidNumber('10 001 ')).toBeFalsy();
    expect(isValidNumber(null)).toBeFalsy();
    expect(isValidNumber(undefined)).toBeFalsy();
    expect(isValidNumber(undefined)).toBeFalsy();
  });

  it('asNumberOrString()', () => {
    expect(asNumberOrString(NaN)).toEqual(NaN);
    expect(asNumberOrString(1)).toEqual(1);
    expect(asNumberOrString('1')).toEqual(1);
    expect(asNumberOrString('1,1')).toEqual(1.1);
    expect(asNumberOrString('1.1')).toEqual(1.1);
    expect(asNumberOrString('001')).toEqual(1);
    expect(asNumberOrString(' 1 958 492 ')).toEqual(1_958_492);
    expect(asNumberOrString('abcdef')).toEqual('abcdef');
    expect(asNumberOrString('abc,def')).toEqual('abc,def');
  });

  it('toPrecision()', () => {
    expect(toPrecision(1, 4)).toEqual(1);
    expect(toPrecision(1.00001, 4)).toEqual(1);
    expect(toPrecision(1.77778, 4)).toEqual(1.7778);
  });

  it('toDegrees()', () => {
    expect(toDegrees(1)).toEqual(57);
  });

  it('toDegrees()', () => {
    expect(toRadians(1)).toEqual(0.0175);
  });
});
