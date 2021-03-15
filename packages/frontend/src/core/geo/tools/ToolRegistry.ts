import { AbstractTool } from './AbstractTool';
import { None } from './common/None';
import { Point } from './point/Point';
import { MapTool } from '@abc-map/frontend-shared';
import { mainStore } from '../../store/store';
import { Circle } from './circle/Circle';
import { LineString } from './line-string/LineString';
import { Polygon } from './polygon/Polygon';
import { Selection } from './selection/Selection';
import { Rectangle } from './rectangle/Rectangle';
import { Text } from './text/Text';
import { getServices } from '../../Services';

export class ToolRegistry {
  public static getAll(): AbstractTool[] {
    const history = getServices().history;
    return [
      new None(mainStore, history),
      new Point(mainStore, history),
      new LineString(mainStore, history),
      new Polygon(mainStore, history),
      new Circle(mainStore, history),
      new Rectangle(mainStore, history),
      new Text(mainStore, history),
      new Selection(mainStore, history),
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
