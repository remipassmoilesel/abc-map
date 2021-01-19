import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { Draw } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from './common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';

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

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const draw = new Draw({
      source,
      type: GeometryType.POINT,
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
    });

    this.applyStyleAfterDraw(draw);
    this.setIdAndHistoryOnEnd(draw, source);
    this.commonModifyInteractions(map, GeometryType.POINT);

    map.addInteraction(draw);
    this.interactions.push(draw);
  }
}
