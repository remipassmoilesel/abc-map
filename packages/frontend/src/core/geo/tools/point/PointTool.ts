import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-shared';
import { Draw } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from '../common/common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../../assets/tool-icons/point.svg';
import { Map } from 'ol';

export class PointTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Point;
  }

  public getIcon(): string {
    return Icon;
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

    this.applyStyleOnDrawEnd(draw);
    this.finalizeOnDrawEnd(draw, source);
    this.commonModifyInteractions(map, GeometryType.POINT);

    map.addInteraction(draw);
    this.interactions.push(draw);
  }
}
