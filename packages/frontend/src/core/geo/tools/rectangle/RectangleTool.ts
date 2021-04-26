import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-commons';
import { Draw } from 'ol/interaction';
import { onlyMainButton } from '../common/common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../../assets/tool-icons/rectangle.svg';
import { Logger } from '@abc-map/frontend-commons';
import GeometryType from 'ol/geom/GeometryType';
import { createBox } from 'ol/interaction/Draw';

const logger = Logger.get('RectangleTool.ts');

/**
 * This tool must be refactored in order to include better modification options
 */
export class RectangleTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Rectangle;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Carrés';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const draw = new Draw({
      source,
      type: GeometryType.CIRCLE, // Circle is intended
      condition: onlyMainButton,
      finishCondition: onlyMainButton,
      geometryFunction: createBox(),
    });

    this.applyStyleOnDrawEnd(draw);
    this.finalizeOnDrawEnd(draw, source);
    this.commonModifyInteractions(map, GeometryType.POLYGON); // Polygon is intended

    map.addInteraction(draw);
    this.interactions.push(draw);
  }
}
