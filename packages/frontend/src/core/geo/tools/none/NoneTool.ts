import { AbstractTool } from '../AbstractTool';
import Icon from '../../../../assets/tool-icons/none.svg';
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

  protected setupInternal(map: Map) {
    const interactions = defaultInteractions();
    interactions.forEach((i) => map.addInteraction(i));

    this.interactions.push(...interactions);
  }
}