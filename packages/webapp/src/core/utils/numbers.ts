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

export function asValidNumber(x: unknown): number | null {
  if (!['number', 'string'].includes(typeof x)) {
    return null;
  }

  const number = asNumberOrString(x as string | number);
  return isValidNumber(number) ? number : null;
}

export function isValidNumber(x: unknown): x is number {
  if (!['number', 'string'].includes(typeof x)) {
    return false;
  }

  return !isNaN(x as number) && !isNaN(parseFloat(x as string));
}

/**
 * If passed argument "looks like" a number (001, 111, 1 000 000, 1.111, "1,111", ...) it will be converted.
 *
 * Otherwise argument will be returned as a string. It is useful for text inputs.
 *
 * @param x
 */
export function asNumberOrString(x: string | number | boolean | null | undefined): number | string {
  if (x === null || x === undefined) {
    return '';
  }

  if (typeof x === 'boolean') {
    return x + '';
  }

  if (typeof x === 'number') {
    return x;
  }

  // We normalize float separator
  let maybeNumber = x;
  if (maybeNumber.indexOf(',')) {
    maybeNumber = maybeNumber.replace(',', '.');
  }

  // We remove blank chars
  maybeNumber = maybeNumber.replace(new RegExp('\\s', 'ig'), '');

  if (isValidNumber(maybeNumber)) {
    return parseFloat(maybeNumber);
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

export function normalize(value: number, min: number, max: number, precision = 8): number {
  const atPrecision = toPrecision(value, precision);
  const notBelowMin = Math.max(min, atPrecision);
  const notAboveMax = Math.min(max, notBelowMin);
  return notAboveMax;
}
