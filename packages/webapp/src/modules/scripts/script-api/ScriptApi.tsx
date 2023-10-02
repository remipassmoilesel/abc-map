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

import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { ScriptLayer } from './ScriptLayer';
import { Services } from '../../../core/Services';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('ScriptApi.tsx');

export interface ScriptApi {
  getMap: () => MapWrapper;
  getLayers: () => ScriptLayer[];
  loadScript: (url: string) => void;
}

export function scriptApiFactory(map: MapWrapper): ScriptApi {
  return {
    getMap: () => map,
    getLayers: () =>
      map.getLayers().map((layer) => {
        const projection = layer.getProjection() || map.getProjection();
        return new ScriptLayer(layer, projection);
      }),
    loadScript,
  };
}

export function getScriptApi(services: Services): ScriptApi {
  const { geo } = services;
  const map = geo.getMainMap();

  return scriptApiFactory(map);
}

export async function loadScript(src: string): Promise<void> {
  const scripts = document.body.querySelectorAll('script');
  const alreadyExists = Array.from(scripts).find((script) => script.src === src);
  if (alreadyExists) {
    logger.warn('Script already loaded: ' + src);
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';

  return new Promise((resolve, reject) => {
    script.onerror = function (err) {
      const message = typeof err === 'string' ? err : 'Error: ' + err.type;
      reject(new Error(message));
    };
    script.onload = function () {
      resolve();
    };

    script.src = src;
    document.body.appendChild(script);
  });
}
