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

import Map from 'ol/Map';
import { MapWrapper } from './MapWrapper';
import { Views } from '../Views';

export class MapFactory {
  public static createDefault(empty = false): MapWrapper {
    const internal = new Map({
      layers: [],
      controls: [],
      view: Views.defaultOlView(),
    });

    const map = MapWrapper.from(internal);
    !empty && map.setDefaultLayers();
    map.setDefaultTool();

    return map;
  }

  public static createLayoutPreview(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: [],
      layers: [],
      view: Views.defaultOlView(),
    });

    const map = MapWrapper.from(internal);
    map.setDefaultTool();

    return map;
  }

  public static createNaked(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: [],
      layers: [],
      view: Views.defaultOlView(),
    });

    return MapWrapper.from(internal);
  }
}
