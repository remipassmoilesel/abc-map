import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-shared';
import Icon from '../../../../assets/tool-icons/none.svg';

export class None extends AbstractTool {
  public getId(): MapTool {
    return MapTool.None;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Aucun';
  }
}
