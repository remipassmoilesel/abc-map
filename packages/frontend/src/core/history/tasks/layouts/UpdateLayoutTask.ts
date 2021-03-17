import { Task } from '../../Task';
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared-entities';
import { getServices } from '../../../Services';

export class UpdateLayoutTask extends Task {
  public static create(before: AbcLayout, after: AbcLayout) {
    return new UpdateLayoutTask(getServices().project, before, after);
  }

  constructor(private project: ProjectService, private before: AbcLayout, private after: AbcLayout) {
    super();
  }

  public async undo(): Promise<void> {
    this.project.updateLayout(this.before);
  }

  public async redo(): Promise<void> {
    this.project.updateLayout(this.after);
  }
}
