import { AbstractTool } from '../AbstractTool';
import Icon from '../../../../assets/tool-icons/none.svg';
import VectorSource from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import { Map } from 'ol';
import { defaultInteractions } from '../../map/interactions';
import { MapTool } from '@abc-map/frontend-commons';

export class NoneTool extends AbstractTool {
  public getId(): MapTool {
    return MapTool.None;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Aucun';
  }

  public setup(map: Map, source: VectorSource<Geometry>) {
    super.setup(map, source);

    const interactions = defaultInteractions();
    interactions.forEach((i) => map.addInteraction(i));

    this.interactions.push(...interactions);
  }
}
