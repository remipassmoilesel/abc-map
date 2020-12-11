import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { AbcProject } from '@abc-map/shared-entities';
import { Logger } from '../../core/utils/Logger';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Constants } from '../../core/Constants';
import './ProjectControls.scss';

const logger = Logger.get('ProjectControls.tsx');

interface State {
  projects: AbcProject[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

const mapStateToProps = (state: RootState) => ({
  project: state.project.current,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class ProjectControls extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  public render(): ReactNode {
    const projects = this.state.projects;
    return (
      <div className={'project-controls'}>
        <div className={'control-item'}>
          <button onClick={this.newProject} type={'button'} className={'btn btn-link'}>
            Nouveau projet
          </button>
        </div>
        <div className={'control-item'}>
          Projects récents:
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
          <button onClick={this.saveProject} type={'button'} className={'btn btn-link'}>
            Enregistrer
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.exportProject} type={'button'} className={'btn btn-link'}>
            Exporter le projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.importProject} type={'button'} className={'btn btn-link'}>
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
      .then((projects) => this.setState((st) => ({ ...st, projects })))
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  }

  private newProject = () => {
    this.services.project.newProject();
    this.services.toasts.info('Nouveau projet créé');
  };

  private saveProject = () => {
    const map = this.services.map.getMainMap();
    let project = this.props.project;
    if (!map || !project) {
      return this.services.toasts.genericError();
    }

    this.services.toasts.info('Enregistrement en cours ...');

    const layers = this.services.map.exportLayers(map);
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
    const map = this.services.map.getMainMap();
    if (!map) {
      return this.services.toasts.genericError();
    }

    this.services.project.loadRemoteProject(id).then(() => this.services.toasts.info('Projet ouvert !'));
  }

  private exportProject = () => {
    const map = this.services.map.getMainMap();
    let project = this.props.project;
    if (!map || !project) {
      return this.services.toasts.genericError();
    }

    this.services.toasts.info('Export en cours ...');

    const layers = this.services.map.exportLayers(map);
    project = {
      ...project,
      layers,
    };

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
        .then(() => this.services.toasts.info('Project importé !'))
        .catch((err) => {
          this.services.toasts.error(err.message);
        })
        .finally(() => {
          fileNode.remove();
        });
    };
  };

  private downloadProject(project: AbcProject) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project));
    const anchorNode = document.createElement('a');
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
    return fileNode;
  }
}

export default connector(ProjectControls);
