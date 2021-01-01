import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { Draw, Interaction } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from './common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';

export class Point extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Point;
  }

  public getIcon(): string {
    return 'PT';
  }

  public getLabel(): string {
    return 'Point';
  }

  public getMapInteractions(source: VectorSource<Geometry>): Interaction[] {
    const draw = new Draw({
      source,
      type: GeometryType.POINT,
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
    });
    this.applyStyleAfterDraw(draw);
    this.registerTaskOnDraw(draw, source);
    return [draw, ...this.commonModifyInteractions(source)];
  }
}
