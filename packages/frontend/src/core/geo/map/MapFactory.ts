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
import { DragPan, KeyboardPan, MouseWheelZoom } from 'ol/interaction';

export class MapFactory {
  public static createDefault(): MapWrapper {
    const internal = new Map({
      layers: [],
      controls: [],
      view: Views.defaultOlView(),
    });

    const map = new MapWrapper(internal);
    map.setDefaultLayers();
    map.setDefaultInteractions();

    return map;
  }

  public static createLayoutPreview(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: [new DragPan(), new KeyboardPan(), new MouseWheelZoom()],
      view: Views.defaultOlView(),
      layers: [],
    });
    return new MapWrapper(internal);
  }

  public static createNaked(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: [],
      view: Views.defaultOlView(),
      layers: [],
    });
    return new MapWrapper(internal);
  }
}
