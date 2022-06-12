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

export function isValidNumber(x: any): x is number {
  return !isNaN(x) && !isNaN(parseFloat(x));
}

/**
 * If passed argument "looks like" a number (001, 111, 1 000 000, ...) it will be converted to.
 * @param x
 */
export function asNumberOrString(x: string | number): number | string {
  let value = x;

  if (typeof value === 'number') {
    return value;
  }

  // We normalize float separator
  if (value.indexOf(',')) {
    value = value.replace(',', '.');
  }

  // We remove blank chars
  value = value.replace(new RegExp('\\s', 'ig'), '');

  if (isValidNumber(value)) {
    return parseFloat(value);
  } else {
    return x;
  }
}

export function toPrecision(n: number, precision = 4): number {
  return Math.round(n * 10 ** precision) / 10 ** precision;
}

export function toDegrees(radians: number): number {
  return toPrecision((radians * 180) / Math.PI, 4);
}

export function toRadians(degrees: number): number {
  return toPrecision((degrees * Math.PI) / 180, 4);
}

export function isDefined(num: number | undefined): num is number {
  return typeof num === 'number';
}

export function normalize(value: number, min: number, max: number, precision = 8): number {
  const atPrecision = toPrecision(value, precision);
  const notBelowMin = Math.max(min, atPrecision);
  const notAboveMax = Math.min(max, notBelowMin);
  return notAboveMax;
}
