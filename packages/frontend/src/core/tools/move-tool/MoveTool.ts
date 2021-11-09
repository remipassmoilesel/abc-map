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

import { AbstractTool } from '../AbstractTool';
import Icon from '../../../assets/tool-icons/move.inline.svg';
import { Map } from 'ol';
import { MapTool } from '@abc-map/shared';
import { DoubleClickZoom, DragPan, KeyboardPan, MouseWheelZoom } from 'ol/interaction';

export class MoveTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Move;
  }

  public getIcon(): string {
    return Icon;
  }

  public getI18nLabel(): string {
    return 'MoveMap';
  }

  protected setupInternal(map: Map) {
    const interactions = [new DoubleClickZoom(), new DragPan(), new KeyboardPan(), new MouseWheelZoom()];

    interactions.forEach((i) => map.addInteraction(i));

    this.interactions.push(...interactions);
  }
}
