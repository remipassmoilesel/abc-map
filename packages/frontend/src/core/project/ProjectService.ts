import { MainStore } from '../store';
import { ProjectActions } from '../store/project/actions';
import { Logger } from '../utils/Logger';
import { AbcProject } from '@abc-map/shared-entities';

const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(private store: MainStore) {}

  public newProject(): void {
    this.store.dispatch(ProjectActions.newProject());
    logger.info('New project created');
  }

  public getProject(): AbcProject | undefined {
    return this.store.getState().project.current;
  }
}
