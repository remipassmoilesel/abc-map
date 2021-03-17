import { Task } from '../../Task';
import { ProjectService } from '../../../project/ProjectService';
import { AbcLayout } from '@abc-map/shared-entities';
import { getServices } from '../../../Services';
import { Logger } from '@abc-map/frontend-shared';

const logger = Logger.get('SetLayoutIndexTask');

export class SetLayoutIndexTask extends Task {
  public static create(layout: AbcLayout, oldIndex: number, newIndex: number) {
    return new SetLayoutIndexTask(getServices().project, layout, oldIndex, newIndex);
  }

  constructor(private project: ProjectService, private layout: AbcLayout, private oldIndex: number, private newIndex: number) {
    super();
  }

  public async undo(): Promise<void> {
    this.project.setLayoutIndex(this.layout, this.oldIndex);
  }

  public async redo(): Promise<void> {
    this.project.setLayoutIndex(this.layout, this.newIndex);
  }
}
