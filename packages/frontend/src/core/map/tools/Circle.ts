import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { Draw, Interaction } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from './common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';

export class Circle extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Circle;
  }

  public getIcon(): string {
    return 'CL';
  }

  public getLabel(): string {
    return 'Cercles';
  }

  public getMapInteractions(source: VectorSource<Geometry>): Interaction[] {
    const draw = new Draw({
      source,
      type: GeometryType.CIRCLE,
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
    });
    this.applyStyleAfterDraw(draw);
    this.registerTaskOnDraw(draw, source);
    return [draw, ...this.commonModifyInteractions(source)];
  }
}
