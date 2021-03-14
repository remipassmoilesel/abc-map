import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { UserStatus } from '@abc-map/shared-entities';
import { Logger } from '@abc-map/frontend-shared';
import { Constants } from '../../../core/Constants';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../core/store/reducer';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import OpenRemoteProjectModal from './OpenRemoteProjectModal';

const logger = Logger.get('ProjectControls.tsx');

export interface State {
  remoteProjectModal: boolean;
}

const mapStateToProps = (state: MainState) => ({
  project: state.project.metadata,
  user: state.authentication.user,
  userStatus: state.authentication.userStatus,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

class ProjectControls extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      remoteProjectModal: false,
    };
  }

  public render(): ReactNode {
    const remoteProjectModal = this.state.remoteProjectModal;
    const userAuthenticated = this.props.userStatus === UserStatus.Authenticated;
    return (
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={this.importProject} type={'button'} className={'btn btn-link'} data-cy={'import-project'}>
            <i className={'fa fa-upload mr-2'} />
            Importer un projet
          </button>
        </div>
        {userAuthenticated && (
          <div className={'control-item'}>
            <button onClick={this.openRemoteModal} type={'button'} className={'btn btn-link'} data-cy={'open-remote-project'}>
              <i className={'fa fa-globe-europe mr-2'} /> Ouvrir un projet
            </button>
          </div>
        )}
        <div className={'control-item'}>
          <button onClick={this.newProject} type={'button'} className={'btn btn-link'} data-cy={'new-project'}>
            <i className={'fa fa-file mr-2'} /> Nouveau projet
          </button>
        </div>
        {userAuthenticated && (
          <div className={'control-item'}>
            <button onClick={this.saveProject} type={'button'} className={'btn btn-link'} data-cy={'save-project'}>
              <i className={'fa fa-pen-alt mr-2'} />
              Enregistrer en ligne
            </button>
          </div>
        )}
        <div className={'control-item'}>
          <button onClick={this.exportAndDownloadProject} type={'button'} className={'btn btn-link'} data-cy={'export-project'}>
            <i className={'fa fa-download mr-2'} />
            Exporter le projet
          </button>
        </div>

        {remoteProjectModal && <OpenRemoteProjectModal onHide={this.handleRemoteProjectModalHide} />}
      </div>
    );
  }

  private newProject = () => {
    this.services.project.newProject();
    this.services.toasts.info('Nouveau projet créé');
  };

  private saveProject = () => {
    if (this.props.userStatus !== UserStatus.Authenticated) {
      return this.services.toasts.info('Vous devez être connecté pour enregistrer votre projet');
    }

    this.services.toasts.info('Enregistrement en cours ...');
    return this.services.project
      .exportCurrentProject()
      .then((project) => {
        if (project) {
          return this.services.project.save(project);
        }
      })
      .then(() => {
        this.services.toasts.info('Projet enregistré !');
      })
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  };

  private openRemoteModal = () => {
    this.setState({ remoteProjectModal: true });
  };

  private handleRemoteProjectModalHide = () => {
    this.setState({ remoteProjectModal: false });
  };

  private exportAndDownloadProject = () => {
    this.services.toasts.info('Export en cours ...');
    return this.services.project
      .exportCurrentProject()
      .then((project) => {
        if (project) {
          this.services.toasts.info('Export terminé !');
          const name = `project.${Constants.EXTENSION}`;
          FileIO.output(URL.createObjectURL(project.project), name);
        }
      })
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  };

  private importProject = () => {
    FileIO.openInput(InputType.Single, '.abm2').then(async (result) => {
      if (InputResultType.Canceled === result.type) {
        return;
      }

      if (result.files.length !== 1) {
        return this.services.toasts.error('Vous devez sélectionner un fichier');
      }

      const file = result.files[0];
      if (!file.name.endsWith(Constants.EXTENSION)) {
        return this.services.toasts.error('Vous devez sélectionner un fichier au format abm2');
      }

      this.services.toasts.info('Chargement ...');
      return this.services.project
        .loadProject(file)
        .then(() => {
          this.services.history.clean();
          this.services.toasts.info('Projet importé !');
        })
        .catch((err) => {
          this.services.toasts.error(err.message);
        });
    });
  };
}

export default connector(ProjectControls);
