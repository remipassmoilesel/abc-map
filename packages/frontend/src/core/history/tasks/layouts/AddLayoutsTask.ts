import { Task } from '../../Task';
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared-entities';
import { getServices } from '../../../Services';

export class AddLayoutsTask extends Task {
  public static create(layouts: AbcLayout[]) {
    return new AddLayoutsTask(getServices().project, layouts);
  }

  private layouts: AbcLayout[];

  constructor(private project: ProjectService, layouts: AbcLayout[]) {
    super();
    this.layouts = layouts.slice();
  }

  public async undo(): Promise<void> {
    this.project.removeLayouts(this.layouts.map((lay) => lay.id));
  }

  public async redo(): Promise<void> {
    this.project.addLayouts(this.layouts);
  }
}
