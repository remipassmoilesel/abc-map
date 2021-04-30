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
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { ScriptLayer } from './ScriptLayer';

export class ScriptMap {
  constructor(private map: MapWrapper) {}

  public listLayers(): ScriptLayer[] {
    return this.map.getLayers().map((lay) => ({ id: lay.getId() || '<no-id>', name: lay.getName() || '<no-name>' }));
  }

  public getFeaturesOfLayer(name: string): Feature<Geometry>[] {
    const layer = this.map.getLayers().find((lay) => lay.getName() === name);
    if (!layer) {
      throw new Error(`Layer name not found: ${name}`);
    }

    if (!layer.isVector()) {
      throw new Error(`Layer with name ${name} is not a vector layer`);
    }

    return layer.getSource().getFeatures();
  }

  public getFeaturesOfLayerById(id: string): Feature<Geometry>[] {
    const layer = this.map.getLayers().find((lay) => lay.getId() === id);
    if (!layer) {
      throw new Error(`Layer id not found: ${id}`);
    }

    if (!layer.isVector()) {
      throw new Error(`Layer with id ${id} is not a vector layer`);
    }

    return layer.getSource().getFeatures();
  }
}
