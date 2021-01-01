import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { Interaction } from 'ol/interaction';

export class None extends AbstractTool {
  public getId(): MapTool {
    return MapTool.None;
  }

  public getIcon(): string {
    return 'AU';
  }

  public getLabel(): string {
    return 'Aucun';
  }

  public getMapInteractions(): Interaction[] {
    return [];
  }
}
