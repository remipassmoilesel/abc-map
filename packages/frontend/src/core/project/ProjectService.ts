import { MainStore } from '../store';
import { ProjectActions } from '../store/project/actions';
import { Logger } from '../utils/Logger';
import { AbcProject } from '@abc-map/shared-entities';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { MapService } from '../map/MapService';
import { Abm2Reader } from './Abm2Reader';

const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(private httpClient: AxiosInstance, private store: MainStore, private mapService: MapService) {}

  public getCurrent(): AbcProject | undefined {
    return this.store.getState().project.current;
  }

  public newProject(): void {
    const map = this.mapService.getMainMap();
    if (map) {
      this.mapService.resetMap(map);
    }
    this.store.dispatch(ProjectActions.newProject(ProjectFactory.newProject()));
    logger.info('New project created');
  }

  public save(project: AbcProject): Promise<void> {
    return this.httpClient.post(`/project`, project).then(() => undefined);
  }

  public list(): Promise<AbcProject[]> {
    return this.httpClient.get(`/project/list`).then((res) => res.data);
  }

  public findById(id: string): Promise<AbcProject | undefined> {
    return this.httpClient.get(`/project/${id}`).then((res) => res.data);
  }

  public loadRemoteProject(id: string): Promise<void> {
    return this.findById(id).then((project) => {
      if (!project) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadProject(project);
    });
  }

  public loadProject(project: AbcProject): void {
    const map = this.mapService.getMainMap();
    if (map) {
      this.mapService.importProject(project, map);
    }
  }

  public loadProjectFromFile(file: File): Promise<void> {
    return Abm2Reader.fromFile(file).then((pr) => this.loadProject(pr));
  }
}
