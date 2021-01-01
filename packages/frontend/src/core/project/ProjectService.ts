import { ProjectActions } from '../store/project/actions';
import { Logger } from '../utils/Logger';
import { AbcLayout, AbcProject, AbcProjection, AbcProjectMetadata, LayoutFormat } from '@abc-map/shared-entities';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../map/GeoService';
import { Abm2Reader } from './Abm2Reader';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import * as uuid from 'uuid';
import { MainStore } from '../store/store';

export const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(private httpClient: AxiosInstance, private store: MainStore, private geoService: GeoService) {}

  public newProject(): void {
    const map = this.geoService.getMainMap();
    map.reset();
    this.store.dispatch(ProjectActions.newProject(ProjectFactory.newProjectMetadata()));
    logger.info('New project created');
  }

  public getCurrentMetadata(): AbcProjectMetadata {
    return this.store.getState().project.metadata;
  }

  public async exportCurrentProject(): Promise<AbcProject> {
    const metadata = this.store.getState().project.metadata;
    const map = this.geoService.getMainMap();
    const layers = this.geoService.exportLayers(map);
    const layouts = this.store.getState().project.layouts;
    return {
      metadata,
      layers,
      layouts,
    };
  }

  public save(project: AbcProject): Promise<void> {
    return this.httpClient.post(Api.saveProject(), project).then(() => undefined);
  }

  public list(): Promise<AbcProject[]> {
    return this.httpClient.get(Api.listProject()).then((res) => res.data);
  }

  public findById(id: string): Promise<AbcProject | undefined> {
    return this.httpClient.get(Api.findById(id)).then((res) => res.data);
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
    const map = this.geoService.getMainMap();
    this.geoService.importProject(map, project);
    this.store.dispatch(ProjectActions.loadProject(project));
  }

  public loadProjectFromFile(file: File): Promise<void> {
    return Abm2Reader.fromFile(file).then((pr) => this.loadProject(pr));
  }

  public newLayout(name: string, format: LayoutFormat, center: number[], resolution: number, projection: AbcProjection): AbcLayout {
    const layout: AbcLayout = {
      id: uuid.v4(),
      name,
      format,
      view: {
        center,
        resolution,
        projection,
      },
    };
    this.store.dispatch(ProjectActions.newLayout(layout));
    return layout;
  }

  public updateLayout(layout: AbcLayout) {
    if (!layout.id) {
      throw new Error(`Cannot update layout without id: ${JSON.stringify(layout)}`);
    }
    this.store.dispatch(ProjectActions.updateLayout(layout));
  }

  public clearLayouts(): void {
    this.store.dispatch(ProjectActions.clearLayouts());
  }

  public renameProject(name: string) {
    this.store.dispatch(ProjectActions.renameProject(name));
  }
}
