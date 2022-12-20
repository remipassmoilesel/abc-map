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

import { ModuleApi } from '@abc-map/module-api';

export type LogFunction = (data: object | undefined) => void;

export interface ScriptArguments {
  moduleApi: ModuleApi;
  log: LogFunction;
}

export interface ErrorPosition {
  line: number;
  column: number;
}

export const FirefoxErrorRegexp = new RegExp(/AsyncFunction:([0-9]+):([0-9]+)/);
export const ChromiumErrorRegexp = new RegExp(/<anonymous>:([0-9]+):([0-9]+)/);

export class ScriptError extends Error {
  constructor(message: string, public output: string[] = []) {
    super(message);
  }
}

export const Example = `\
// You can access various helpers from "moduleApi" constant
const { mainMap } = moduleApi;
mainMap.getLayers().forEach((layer) => {
  if (layer.isVector()) {
    log(\`Layer \${layer.getName()}: \${layer.getSource().getFeatures().length} features\`);
  } else {
    log(\`Layer \${layer.getName()}: \${layer.getType()} layer\`);
  }
});

`;
