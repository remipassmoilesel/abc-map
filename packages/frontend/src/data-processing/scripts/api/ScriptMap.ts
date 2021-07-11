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

import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { ScriptLayer } from './ScriptLayer';

export class ScriptMap {
  constructor(private map: MapWrapper) {}

  public listLayers(): ScriptLayer[] {
    return this.map.getLayers().map((lay) => new ScriptLayer(lay));
  }

  public findByName(name: string): ScriptLayer | undefined {
    const layer = this.map.getLayers().find((lay) => lay.getName() === name);
    if (layer) {
      return new ScriptLayer(layer);
    }
  }

  public findById(id: string): ScriptLayer | undefined {
    const layer = this.map.getLayers().find((lay) => lay.getId() === id);
    if (layer) {
      return new ScriptLayer(layer);
    }
  }

  public unwrap() {
    return this.map.unwrap();
  }
}
