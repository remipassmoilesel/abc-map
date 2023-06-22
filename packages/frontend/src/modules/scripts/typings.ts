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

export function getScriptErrorOutput(err: unknown): string[] {
  return (!!err && typeof err === 'object' && 'output' in err && (err as ScriptError).output) || [];
}

export const Example = `\
// This is javascript code. Here you can modify map, layers and data.

// You can access various helpers from "moduleApi" constant.
// "moduleApi.mainMap" is a variable containing all the data of your project.
for (const layer of moduleApi.mainMap.getLayers()) {
    // If layer not is vector, we only display its type
    if (layer.isVector() === false) {
        log(\`Layer \${layer.getName()} is a \${layer.getType()} layer.\`);
    }

    // If layer is vector, we display features
    else {
        const features = layer.getSource().getFeatures();
        log(\`Layer \${layer.getName()} has \${features.length} features\`);

        for (const feature of features) {
            const id = feature.getId();
            const geometry = feature.getGeometry().getType();
            log(\`    Feature \${id} has geometry \${geometry}\`);
            console.log(\`Feature \${id} has properties\`, feature.getProperties())
        }

        !!features.length && '    This layer does not have a feature';
    }
}
`;
