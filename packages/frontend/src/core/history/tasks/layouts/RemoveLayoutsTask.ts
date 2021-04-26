import { Task } from '../../Task';
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared-entities';
import { getServices } from '../../../Services';
import { Logger } from '@abc-map/frontend-commons';

const logger = Logger.get('RemoveLayoutsTask');

export class RemoveLayoutsTask extends Task {
  public static create(layouts: AbcLayout[]) {
    return new RemoveLayoutsTask(getServices().project, layouts);
  }

  private layouts: AbcLayout[];

  constructor(private project: ProjectService, layouts: AbcLayout[]) {
    super();
    this.layouts = layouts.slice();
  }

  public async undo(): Promise<void> {
    this.project.addLayouts(this.layouts);
  }

  public async redo(): Promise<void> {
    this.project.removeLayouts(this.layouts.map((lay) => lay.id));
  }
}
