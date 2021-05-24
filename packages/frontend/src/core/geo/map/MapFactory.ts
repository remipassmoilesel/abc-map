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

import { Map } from 'ol';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { DEFAULT_PROJECTION } from '@abc-map/shared';
import { MapWrapper } from './MapWrapper';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { layoutMapInteractions } from './interactions';
import * as _ from 'lodash';

const defaultView = createView(9, [3.9, 43]);

const views: View[] = [
  createView(6, [-65, 47]),
  createView(6, [-85, 23]),
  createView(6, [-76, -12]),
  createView(11, [55.45, -4.66]),
  createView(11, [39.67, -4.06]),
  createView(4, [10, 2]),
  createView(5, [46, 20]),
  createView(5, [107, 19]),
  createView(5, [134, -28]),
  createView(5, [46, -19]),
  createView(6, [-19, 17]),
  createView(9, [3.9, 43]),
  createView(9, [-5, 36]),
];

export class MapFactory {
  public static createDefault(): MapWrapper {
    const scale = new ScaleLine({ units: 'metric' });
    const internal = new Map({
      layers: [],
      controls: defaultControls().extend([scale]),
      view: defaultView,
    });

    const map = new MapWrapper(internal);
    map.defaultLayers();
    map.setDefaultInteractions();

    return map;
  }

  public static createDefaultWithRandomView(): MapWrapper {
    const map = this.createDefault();
    const view = _.sample(views);
    map.unwrap().setView(view || defaultView);
    return map;
  }

  public static createLayout(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: layoutMapInteractions(),
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
      layers: [],
    });
    return new MapWrapper(internal);
  }

  public static createNaked(): MapWrapper {
    const internal = new Map({
      controls: [],
      interactions: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
        projection: DEFAULT_PROJECTION.name,
      }),
      layers: [],
    });
    return new MapWrapper(internal);
  }
}

function createView(zoom: number, lonLat: [number, number], projection = DEFAULT_PROJECTION): View {
  return new View({
    center: fromLonLat(lonLat),
    zoom,
    projection: projection.name,
  });
}
