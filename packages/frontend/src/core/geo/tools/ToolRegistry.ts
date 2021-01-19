import { AbstractTool } from './AbstractTool';
import { None } from './None';
import { Point } from './Point';
import { MapTool } from '@abc-map/shared-entities';
import { mainStore } from '../../store/store';
import { services } from '../../Services';
import { Circle } from './Circle';
import { LineString } from './LineString';
import { Polygon } from './Polygon';
import { Selection } from './Selection';

export class ToolRegistry {
  public static getAll(): AbstractTool[] {
    return [
      new None(mainStore, services().history),
      new Circle(mainStore, services().history),
      new LineString(mainStore, services().history),
      new Point(mainStore, services().history),
      new Polygon(mainStore, services().history),
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
