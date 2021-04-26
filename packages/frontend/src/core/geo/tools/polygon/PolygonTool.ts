import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-commons';
import { Draw } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from '../common/common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../../assets/tool-icons/polygon.svg';

export class PolygonTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Polygon;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Polygones';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const draw = new Draw({
      source,
      type: GeometryType.POLYGON,
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
    });
    this.applyStyleOnDrawEnd(draw);
    this.finalizeOnDrawEnd(draw, source);
    this.commonModifyInteractions(map, GeometryType.POLYGON);

    map.addInteraction(draw);
    this.interactions.push(draw);
  }
}
