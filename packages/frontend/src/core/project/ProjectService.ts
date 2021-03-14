import { ProjectActions } from '../store/project/actions';
import { BlobReader, Logger } from '@abc-map/frontend-shared';
import { AbcLayout, AbcProject, AbcProjection, AbcProjectMetadata, LayerType, LayoutFormat, ManifestName, WmsMetadata } from '@abc-map/shared-entities';
import { AxiosInstance } from 'axios';
import { ProjectFactory } from './ProjectFactory';
import { GeoService } from '../geo/GeoService';
import { ProjectRoutes as Api } from '../http/ApiRoutes';
import uuid from 'uuid-random';
import { MainStore } from '../store/store';
import { ModalStatus } from '../ui/Modals.types';
import { Encryption } from '../utils/Encryption';
import { HistoryService } from '../history/HistoryService';
import { Zipper } from '@abc-map/frontend-shared';
import { CompressedProject } from './CompressedProject';
import { ModalService } from '../ui/ModalService';

export const logger = Logger.get('ProjectService.ts', 'info');

export class ProjectService {
  constructor(
    private jsonClient: AxiosInstance,
    private downloadClient: AxiosInstance,
    private store: MainStore,
    private geoService: GeoService,
    private modals: ModalService,
    private history: HistoryService
  ) {}

  public newProject(): void {
    this.geoService.getMainMap().resetLayers();
    this.history.clean();
    this.store.dispatch(ProjectActions.newProject(ProjectFactory.newProjectMetadata()));
    logger.info('New project created');
  }

  public getCurrentMetadata(): AbcProjectMetadata {
    return this.store.getState().project.metadata;
  }

  public async exportCurrentProject(): Promise<CompressedProject | undefined> {
    const exportProject = async (password?: string): Promise<CompressedProject> => {
      const metadata = this.store.getState().project.metadata;
      const project: AbcProject = {
        metadata,
        layers: await this.geoService.exportLayers(this.geoService.getMainMap(), password),
        layouts: this.store.getState().project.layouts,
      };
      const zip = await Zipper.zipFiles([{ path: ManifestName, content: new Blob([JSON.stringify(project)]) }]);
      return { project: zip, metadata };
    };

    if (this.geoService.getMainMap().containsCredentials()) {
      const message = 'Votre projet contient des identifiants, vous devez choisir un mot de passe pour les protéger.';
      return this.modals.passwordModal('Mot de passe principal', message).then((ev) => {
        if (ModalStatus.Confirmed === ev.status) {
          return exportProject(ev.value);
        }
      });
    } else {
      return exportProject();
    }
  }

  public save(project: CompressedProject): Promise<void> {
    const formData = new FormData();
    formData.append('metadata', JSON.stringify(project.metadata));
    formData.append('project', project.project as Blob);
    return this.jsonClient
      .post(Api.saveProject(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => undefined);
  }

  public list(): Promise<AbcProjectMetadata[]> {
    return this.jsonClient.get(Api.listProject()).then((res) => res.data);
  }

  public findById(id: string): Promise<Blob | undefined> {
    return this.downloadClient.get(Api.findById(id)).then((res) => res.data);
  }

  public loadRemoteProject(id: string): Promise<void> {
    return this.findById(id).then((blob) => {
      if (!blob) {
        return Promise.reject(new Error('Project not found'));
      }
      return this.loadProject(blob);
    });
  }

  public async loadProject(blob: Blob): Promise<void> {
    const unzipped = await Zipper.unzip(blob);
    const manifestFile = unzipped.find((f) => f.path.endsWith(ManifestName));
    if (!manifestFile) {
      return Promise.reject(new Error('Invalid project'));
    }

    const project = JSON.parse(await BlobReader.asString(manifestFile.content));

    const load = async (password?: string) => {
      const map = this.geoService.getMainMap();
      let _project = project;
      if (password) {
        _project = await Encryption.decryptProject(project, password);
      }
      await this.geoService.importProject(map, _project);
      this.store.dispatch(ProjectActions.loadProject(_project));
      this.history.clean();
    };

    // Project is protected by a password
    if (this.containsCredentials(project)) {
      const title = 'Mot de passe';
      const message = 'Ce projet contient des identifiants, veuillez saisir le mot de passe maitre du projet';
      return this.modals.passwordModal(title, message).then((ev) => {
        if (ModalStatus.Confirmed === ev.status) {
          return load(ev.value);
        }
      });
    }

    // Project is not protected by a password
    return load();
  }

  public newLayout(name: string, format: LayoutFormat, center: number[], resolution: number, projection: AbcProjection): AbcLayout {
    const layout: AbcLayout = {
      id: uuid(),
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
