import { AbstractTool } from './AbstractTool';
import { None } from './common/None';
import { Point } from './point/Point';
import { MapTool } from '@abc-map/shared-entities';
import { mainStore } from '../../store/store';
import { services } from '../../Services';
import { Circle } from './circle/Circle';
import { LineString } from './line-string/LineString';
import { Polygon } from './polygon/Polygon';
import { Selection } from './selection/Selection';
import { Rectangle } from './rectangle/Rectangle';
import { Text } from './text/Text';

export class ToolRegistry {
  public static getAll(): AbstractTool[] {
    return [
      new None(mainStore, services().history),
      new Point(mainStore, services().history),
      new LineString(mainStore, services().history),
      new Polygon(mainStore, services().history),
      new Circle(mainStore, services().history),
      new Rectangle(mainStore, services().history),
      new Text(mainStore, services().history),
      new Selection(mainStore, services().history),
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
