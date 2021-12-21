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

import { Tool } from './Tool';
import { MoveMapTool } from './move/MoveMapTool';
import { PointTool } from './point/PointTool';
import { MapTool } from '@abc-map/shared';
import { mainStore } from '../store/store';
import { LineStringTool } from './line-string/LineStringTool';
import { PolygonTool } from './polygon/PolygonTool';
import { SelectionTool } from './selection/SelectionTool';
import { TextTool } from './text/TextTool';
import { getServices } from '../Services';
import { EditPropertiesTool } from './edit-properties/EditPropertiesTool';

export class ToolRegistry {
  public static getAll(): Tool[] {
    const history = getServices().history;
    const modals = getServices().modals;
    return [
      new MoveMapTool(),
      new PointTool(mainStore, history),
      new LineStringTool(mainStore, history),
      new PolygonTool(mainStore, history),
      new TextTool(mainStore, history),
      new SelectionTool(mainStore, history),
      new EditPropertiesTool(mainStore, history, modals),
    ];
  }

  public static getById(id: MapTool): Tool {
    const result = this.getAll().find((tl) => tl.getId() === id);
    if (!result) {
      throw new Error(`Tool not found: ${id}`);
    }
    return result;
  }
}
