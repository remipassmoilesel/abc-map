import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { AbcProject, UserStatus } from '@abc-map/shared-entities';
import { Logger } from '../../../core/utils/Logger';
import { Constants } from '../../../core/Constants';
import { connect, ConnectedProps } from 'react-redux';
import { Env } from '../../../core/utils/Env';
import { MainState } from '../../../core/store/reducer';
import './ProjectControls.scss';

const logger = Logger.get('ProjectControls.tsx');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  recentProjects: AbcProject[];
}

const mapStateToProps = (state: MainState) => ({
  project: state.project.metadata,
  user: state.authentication.user,
  userStatus: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

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
    const userAuthenticated = this.props.userStatus === UserStatus.AUTHENTICATED;
    return (
      <div className={'project-controls control-block'}>
        <div className={'mb-2'}>
          <i className={'fa fa-clock mr-2'} />
          Projets récents:
        </div>
        <div className={'control-item'}>
          <div className={'recent-projects'} data-cy={'recent-projects'}>
            {userAuthenticated &&
              projects.map((pr) => (
                <div key={pr.metadata.id} className={'item'} onClick={() => this.openProject(pr.metadata.id)}>
                  {pr.metadata.name}
                </div>
              ))}
            {userAuthenticated && projects.length < 1 && <div>Aucun projet récent</div>}
            {!userAuthenticated && <div>Vous n&apos;êtes pas connecté</div>}
          </div>
        </div>
        <div className={'control-item'}>
          <button onClick={this.newProject} type={'button'} className={'btn btn-link'} data-cy={'new-project'}>
            <i className={'fa fa-file mr-2'} /> Nouveau projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.saveProject} type={'button'} className={'btn btn-link'} data-cy={'save-project'}>
            <i className={'fa fa-pen-alt mr-2'} />
            Enregistrer en ligne
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.exportProject} type={'button'} className={'btn btn-link'} data-cy={'export-project'}>
            <i className={'fa fa-download mr-2'} />
            Exporter le projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.importProject} type={'button'} className={'btn btn-link'} data-cy={'import-project'}>
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
        this.services.ui.toasts.genericError();
      });
  }

  private newProject = () => {
    this.services.project.newProject();
    this.services.history.clean();
    this.services.ui.toasts.info('Nouveau projet créé');
  };

  private saveProject = () => {
    if (this.props.userStatus !== UserStatus.AUTHENTICATED) {
      return this.services.ui.toasts.info('Vous devez être connecté pour enregistrer votre projet');
    }

    this.services.ui.toasts.info('Enregistrement en cours ...');
    this.services.project
      .exportCurrentProject()
      .then((project) => this.services.project.save(project))
      .then(() => {
        this.services.ui.toasts.info('Projet enregistré !');
        this.updateRecentProjects();
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  };

  private openProject(id: string): void {
    this.services.project.loadRemoteProject(id).then(() => {
      this.services.history.clean();
      this.services.ui.toasts.info('Projet ouvert !');
    });
  }

  private exportProject = () => {
    this.services.ui.toasts.info('Export en cours ...');
    this.services.project
      .exportCurrentProject()
      .then((project) => {
        this.services.ui.toasts.info('Export terminé !');
        this.downloadProject(project);
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  };

  private importProject = () => {
    this.openFileInput(async (files) => {
      if (!files || !files.length) {
        return this.services.ui.toasts.error('Vous devez sélectionner un fichier');
      }

      const file = files[0];
      if (!file.name.endsWith(Constants.EXTENSION)) {
        return this.services.ui.toasts.error('Vous devez sélectionner un fichier au format abm2');
      }

      this.services.ui.toasts.info('Chargement ...');
      return this.services.project
        .loadProjectFromFile(file)
        .then(() => {
          this.services.history.clean();
          this.services.ui.toasts.info('Projet importé !');
        })
        .catch((err) => {
          this.services.ui.toasts.error(err.message);
        });
    });
  };

  private downloadProject(project: AbcProject) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(project))}`;
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `project.${Constants.EXTENSION}`);
    anchor.dataset.cy = 'export-project-output';

    document.body.appendChild(anchor);
    if (!Env.isE2e()) {
      anchor.click();
      anchor.remove();
    }
  }

  private openFileInput(onChange: (files: FileList | null) => Promise<void>): void {
    const fileNode = document.createElement('input');
    fileNode.setAttribute('type', 'file');
    fileNode.style.display = 'none';
    fileNode.dataset.cy = 'import-project-input';
    fileNode.onchange = () => {
      const files = fileNode.files;
      onChange(files).finally(() => fileNode.remove());
    };
    fileNode.oncancel = () => {
      fileNode.remove();
    };

    document.body.appendChild(fileNode);
    if (!Env.isE2e()) {
      fileNode.click();
    }
  }
}

export default connector(ProjectControls);
