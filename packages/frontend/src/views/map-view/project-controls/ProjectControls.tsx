import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { AbcProject } from '@abc-map/shared-entities';
import { Logger } from '../../../core/utils/Logger';
import { Constants } from '../../../core/Constants';
import { Map } from 'ol';
import './ProjectControls.scss';

const logger = Logger.get('ProjectControls.tsx');

interface State {
  recentProjects: AbcProject[];
}

interface Props {
  project?: AbcProject;
  map: Map;
}

class ProjectControls extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      recentProjects: [],
    };
  }

  public render(): ReactNode {
    const projects = this.state.recentProjects;
    return (
      <div className={'project-controls control-block'}>
        <div className={'mb-2'}>
          <i className={'fa fa-clock mr-2'} />
          Projets récents:
        </div>
        <div className={'control-item'}>
          <div className={'recent-projects'}>
            {projects.map((pr) => (
              <div key={pr.metadata.id} className={'item'} onClick={() => this.openProject(pr.metadata.id)}>
                {pr.metadata.name}
              </div>
            ))}
            {projects.length < 1 && <div>Aucun projet récent</div>}
          </div>
        </div>
        <div className={'control-item'}>
          <button onClick={this.newProject} type={'button'} className={'btn btn-link'}>
            <i className={'fa fa-file mr-2'} /> Nouveau projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.saveProject} type={'button'} className={'btn btn-link'}>
            <i className={'fa fa-pen-alt mr-2'} />
            Enregistrer en ligne
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.exportProject} type={'button'} className={'btn btn-link'}>
            <i className={'fa fa-download mr-2'} />
            Exporter le projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.importProject} type={'button'} className={'btn btn-link'}>
            <i className={'fa fa-upload mr-2'} />
            Importer un projet
          </button>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.updateRecentProjects();
  }

  private updateRecentProjects(): void {
    this.services.project
      .list()
      .then((projects) => this.setState({ recentProjects: projects }))
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  }

  private newProject = () => {
    this.services.project.newProject();
    this.services.history.clean();
    this.services.toasts.info('Nouveau projet créé');
  };

  private saveProject = () => {
    let project = this.props.project;
    if (!project) {
      return this.services.toasts.genericError();
    }

    this.services.toasts.info('Enregistrement en cours ...');
    const layers = this.services.map.exportLayers(this.props.map);
    project = {
      ...project,
      layers,
    };

    return this.services.project
      .save(project)
      .then(() => {
        this.services.toasts.info('Project enregistré !');
        this.updateRecentProjects();
      })
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  };

  private openProject(id: string): void {
    this.services.project.loadRemoteProject(id).then(() => {
      this.services.history.clean();
      this.services.toasts.info('Projet ouvert !');
    });
  }

  private exportProject = () => {
    let project = this.props.project;
    if (!project) {
      return this.services.toasts.genericError();
    }

    this.services.toasts.info('Export en cours ...');
    const layers = this.services.map.exportLayers(this.props.map);
    project = {
      ...project,
      layers,
    };

    this.services.toasts.info('Export terminé !');
    this.downloadProject(project);
  };

  private importProject = () => {
    const fileNode = this.createInputFile();
    fileNode.click();

    fileNode.onchange = () => {
      const files = fileNode.files;
      if (!files || !files.length) {
        return this.services.toasts.error('Vous devez sélectionner un fichier');
      }

      const file = files[0];
      if (!file.name.endsWith(Constants.EXTENSION)) {
        return this.services.toasts.error('Vous devez sélectionner un fichier au format abm2');
      }

      this.services.toasts.info('Chargement ...');
      this.services.project
        .loadProjectFromFile(file)
        .then(() => {
          this.services.history.clean();
          this.services.toasts.info('Project importé !');
        })
        .catch((err) => {
          this.services.toasts.error(err.message);
        })
        .finally(() => {
          fileNode.remove();
        });
    };

    fileNode.oncancel = () => {
      fileNode.remove();
    };
  };

  private downloadProject(project: AbcProject) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project));
    const anchorNode = document.createElement('a');
    anchorNode.style.display = 'none';
    anchorNode.setAttribute('href', dataStr);
    anchorNode.setAttribute('download', `project.${Constants.EXTENSION}`);
    document.body.appendChild(anchorNode);
    anchorNode.click();
    anchorNode.remove();
  }

  private createInputFile(): HTMLInputElement {
    const fileNode = document.createElement('input');
    fileNode.setAttribute('type', 'file');
    document.body.appendChild(fileNode);
    fileNode.style.display = 'none';
    return fileNode;
  }
}

export default ProjectControls;
