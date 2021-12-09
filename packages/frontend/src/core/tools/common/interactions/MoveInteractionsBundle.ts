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

import { DragPan, Interaction, KeyboardPan, MouseWheelZoom, PinchZoom } from 'ol/interaction';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Map from 'ol/Map';
import { withControlKey, withMainButton } from '../helpers/common-conditions';

/**
 * This class contains interactions designed to be used in complement of drawing interactions
 */
export class MoveInteractionsBundle {
  private map?: Map;
  private interactions: Interaction[];

  constructor() {
    const condition = (ev: MapBrowserEvent<MouseEvent>) => withControlKey(ev) && withMainButton(ev);
    this.interactions = [new DragPan({ condition }), new KeyboardPan({ condition }), new MouseWheelZoom({ condition }), new PinchZoom({})];
  }

  public setup(map: Map) {
    this.map = map;
    this.interactions.forEach((inter) => map.addInteraction(inter));
  }

  public dispose() {
    this.interactions.forEach((inter) => {
      inter.dispose();
      this.map?.removeInteraction(inter);
    });
  }
}
