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

import View from 'ol/View';
import { AbcView } from '@abc-map/shared/build/project/AbcView';
import { DEFAULT_PROJECTION } from '@abc-map/shared';
import { fromLonLat } from 'ol/proj';
import sample from 'lodash/sample';
import { toPrecision } from '../utils/numbers';

const DefaultView: AbcView = {
  resolution: 39135,
  center: fromLonLat([10, 45], DEFAULT_PROJECTION.name),
  projection: DEFAULT_PROJECTION,
};

// These are selected places, shown when a new project is created
const views: AbcView[] = [
  createView(2445, [-65, 47]),
  createView(2445, [-85, 23]),
  createView(2445, [-76, -12]),
  createView(75, [55.45, -4.66]),
  createView(75, [39.67, -4.06]),
  createView(305785, [10, 2]),
  createView(4890, [46, 20]),
  createView(4890, [117, 36]),
  createView(4890, [134, -28]),
  createView(2445, [46, -19]),
  createView(305, [-16.2, 14]),
  createView(305, [3.9, 43]),
  createView(75, [4.5, 43.5]),
  createView(305, [-5, 36]),
  createView(610, [22, 60]),
  createView(610, [5.88, 60]),
  createView(305, [-1.9, 49.1]),
  createView(150, [-4.6, 48.2]),
];

export class Views {
  public static defaultView(): AbcView {
    return DefaultView;
  }

  public static defaultOlView(): View {
    return new View({
      projection: DefaultView.projection.name,
      center: DefaultView.center,
      resolution: DefaultView.resolution,
    });
  }

  public static random(): AbcView {
    return sample(views) ?? DefaultView;
  }

  public static abcToOl(view: AbcView): View {
    return new View({
      projection: view.projection.name,
      center: view.center,
      resolution: view.resolution,
    });
  }

  public static olToAbc(view: View): AbcView {
    const precision = 9;
    const olProj = view.getProjection();
    const projection = olProj ? { name: olProj.getCode() } : DefaultView.projection;
    return {
      center: (view.getCenter() || DefaultView.center).map((n) => toPrecision(n, precision)),
      resolution: toPrecision(view.getResolution() || DefaultView.resolution, precision),
      projection,
    };
  }
}

function createView(resolution: number, lonLat: [number, number], projection = DEFAULT_PROJECTION): AbcView {
  return {
    resolution,
    center: fromLonLat(lonLat, projection.name),
    projection,
  };
}
