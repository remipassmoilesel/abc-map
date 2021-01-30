import { ProjectActions } from '../store/project/actions';
import { Logger } from '../utils/Logger';
import { AbcLayout, AbcProject, AbcProjection, AbcProjectMetadata, LayerType, LayoutFormat, WmsMetadata } from '@abc-map/shared-entities';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { Abm2Reader } from './Abm2Reader';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import * as uuid from 'uuid';
import { MainStore } from '../store/store';
import { UiService } from '../ui/UiService';
import { ModalStatus } from '../ui/Modals.types';
import { Encryption } from '../utils/Encryption';

export const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(private httpClient: AxiosInstance, private store: MainStore, private geoService: GeoService, private uiService: UiService) {}

  public newProject(): void {
    const map = this.geoService.getMainMap();
    map.resetLayers();
    this.store.dispatch(ProjectActions.newProject(ProjectFactory.newProjectMetadata()));
    logger.info('New project created');
  }

  public getCurrentMetadata(): AbcProjectMetadata {
    return this.store.getState().project.metadata;
  }

  public async exportCurrentProject(): Promise<AbcProject | undefined> {
    const exportProject = async (password?: string) => {
      const metadata = this.store.getState().project.metadata;
      const map = this.geoService.getMainMap();
      const layers = await this.geoService.exportLayers(map, password);
      const layouts = this.store.getState().project.layouts;
      return {
        metadata,
        layers,
        layouts,
      };
    };

    if (this.geoService.getMainMap().containsCredentials()) {
      const message = 'Votre projet contient des identifiants, vous devez choisir un mot de passe pour les protéger.';
      return this.uiService.modals.passwordModal('Mot de passe principal', message).then((ev) => {
        if (ModalStatus.Confirmed === ev.status) {
          return exportProject(ev.value);
        }
      });
    } else {
      return exportProject();
    }
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

  public loadProjectFromFile(file: File): Promise<void> {
    return Abm2Reader.fromFile(file).then((pr) => this.loadProject(pr));
  }

  public async loadProject(project: AbcProject): Promise<void> {
    const load = async (password?: string) => {
      const map = this.geoService.getMainMap();
      let _project = project;
      if (password) {
        _project = await Encryption.decryptProject(project, password);
      }
      this.geoService.importProject(map, _project);
      this.store.dispatch(ProjectActions.loadProject(_project));
    };

    if (this.containsCredentials(project)) {
      const title = 'Mot de passe';
      const message = 'Ce projet contient des identifiants, veuillez saisir le mot de passe maitre du projet';
      return this.uiService.modals.passwordModal(title, message).then((ev) => {
        if (ModalStatus.Confirmed === ev.status) {
          return load(ev.value);
        }
      });
    }
    return load();
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

  private containsCredentials(project: AbcProject): boolean {
    const wmsLayers = project.layers.filter((lay) => LayerType.Wms === lay.type);
    const layerWithAuth = wmsLayers.find((lay) => {
      const metadata: WmsMetadata = lay.metadata as WmsMetadata;
      return metadata.auth?.username && metadata.auth?.password;
    });
    return !!layerWithAuth;
  }
}
