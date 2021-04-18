import { AbstractTool } from './AbstractTool';
import { MoveTool } from './move/MoveTool';
import { PointTool } from './point/PointTool';
import { MapTool } from '@abc-map/frontend-shared';
import { mainStore } from '../../store/store';
import { CircleTool } from './circle/CircleTool';
import { LineStringTool } from './line-string/LineStringTool';
import { PolygonTool } from './polygon/PolygonTool';
import { SelectionTool } from './selection/SelectionTool';
import { RectangleTool } from './rectangle/RectangleTool';
import { TextTool } from './text/TextTool';
import { getServices } from '../../Services';
import { EditPropertiesTool } from './edit-properties/EditPropertiesTool';

export class ToolRegistry {
  public static getAll(): AbstractTool[] {
    const history = getServices().history;
    const modals = getServices().modals;
    return [
      new MoveTool(mainStore, history),
      new PointTool(mainStore, history),
      new LineStringTool(mainStore, history),
      new PolygonTool(mainStore, history),
      new CircleTool(mainStore, history),
      new RectangleTool(mainStore, history),
      new TextTool(mainStore, history),
      new SelectionTool(mainStore, history),
      new EditPropertiesTool(mainStore, history, modals),
    ];
  }

  public static getById(id: MapTool): AbstractTool {
    const result = this.getAll().find((tl) => tl.getId() === id);
    if (!result) {
      throw new Error(`Tool not found: ${id}`);
    }
    return result;
  }
}
