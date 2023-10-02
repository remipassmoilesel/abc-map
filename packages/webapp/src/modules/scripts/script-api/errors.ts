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

export const FirefoxErrorRegexp = new RegExp(/AsyncFunction:([0-9]+):([0-9]+)/);
export const ChromiumErrorRegexp = new RegExp(/<anonymous>:([0-9]+):([0-9]+)/);

export class ScriptError extends Error {
  constructor(message: string, public output: string[] = []) {
    super(message);
  }
}

export function getScriptErrorOutput(err: unknown): string[] {
  return (!!err && typeof err === 'object' && 'output' in err && (err as ScriptError).output) || [];
}

export interface ErrorPosition {
  line: number;
  column: number;
}

export function parseError(error: Error | unknown | any): ErrorPosition | undefined {
  const stack = error?.stack;
  if (typeof stack !== 'string') {
    return;
  }

  const ffMatch = stack.match(FirefoxErrorRegexp);
  const chMatch = stack.match(ChromiumErrorRegexp);
  const match = ffMatch || chMatch;
  if (!match) {
    return;
  }

  const line = parseInt(match[1]) - 3; // 3 is the default offset
  const column = parseInt(match[2]);
  return { line, column };
}
