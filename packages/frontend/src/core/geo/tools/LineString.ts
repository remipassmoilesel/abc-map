import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { Draw } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import { onlyMainButton } from './common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../assets/tool-icons/line.svg';
import { Map } from 'ol';

export class LineString extends AbstractTool {
  public getId(): MapTool {
    return MapTool.LineString;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Lignes';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const draw = new Draw({
      source,
      type: GeometryType.LINE_STRING,
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
    });

    this.applyStyleAfterDraw(draw);
    this.setIdAndHistoryOnEnd(draw, source);
    this.commonModifyInteractions(map, GeometryType.LINE_STRING);

    map.addInteraction(draw);
    this.interactions.push(draw);
  }
}
