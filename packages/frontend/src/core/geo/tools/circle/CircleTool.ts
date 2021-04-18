import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-shared';
import { Draw } from 'ol/interaction';
import { Map } from 'ol';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from '../common/common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../../assets/tool-icons/circle.svg';

export class CircleTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Circle;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Cercles';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const draw = new Draw({
      source,
      type: GeometryType.CIRCLE,
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
    });

    this.applyStyleOnDrawEnd(draw);
    this.finalizeOnDrawEnd(draw, source);
    this.commonModifyInteractions(map, GeometryType.CIRCLE);

    map.addInteraction(draw);
    this.interactions.push(draw);
  }
}
