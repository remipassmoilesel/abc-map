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

import { ScriptContext, ScriptFunction } from './ScriptContext';

export function createScript(content: string): ScriptFunction {
  // Be careful with line ends here, it may break error stacks
  const contextKeys: (keyof ScriptContext)[] = ['log', 'moduleApi', 'scriptApi'];
  const header = `"use strict";return (async function(){ const {${contextKeys.join(', ')}} = context;\n`;
  const footer = `})();`;

  // eslint-disable-next-line no-new-func
  return new Function('context', header + content + footer) as ScriptFunction;
}
