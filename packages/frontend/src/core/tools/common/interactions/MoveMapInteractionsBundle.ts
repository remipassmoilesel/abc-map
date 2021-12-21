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

import { DragPan, Interaction, MouseWheelZoom, PinchZoom } from 'ol/interaction';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Map from 'ol/Map';

export interface Options {
  condition?: (ev: MapBrowserEvent<UIEvent>) => boolean;
}

/**
 * This class contains interactions designed to be used in complement of drawing interactions
 */
export class MoveMapInteractionsBundle {
  private map?: Map;
  private interactions: Interaction[] = [];

  constructor(private options: Options) {}

  public setup(map: Map) {
    this.map = map;

    const condition = this.options.condition;

    this.interactions = [new DragPan({ condition }), new PinchZoom(), new MouseWheelZoom({ condition, onFocusOnly: false })];
    this.interactions.forEach((inter) => map.addInteraction(inter));
  }

  public dispose() {
    this.interactions.forEach((inter) => {
      inter.dispose();
      this.map?.removeInteraction(inter);
    });
  }
}
