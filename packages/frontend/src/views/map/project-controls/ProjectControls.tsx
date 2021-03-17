import React, { Component, ReactNode } from 'react';
import { UserStatus } from '@abc-map/shared-entities';
import { Logger } from '@abc-map/frontend-shared';
import { Constants } from '../../../core/Constants';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../core/store/reducer';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import OpenRemoteProjectModal from './OpenRemoteProjectModal';
import { ModalStatus } from '../../../core/ui/Modals.types';
import { ServiceProps, withServices } from '../../../core/withServices';

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

type Props = ConnectedProps<typeof connector> & ServiceProps;

class ProjectControls extends Component<Props, State> {
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
          <button onClick={this.handleImportProject} type={'button'} className={'btn btn-link'} data-cy={'import-project'}>
            <i className={'fa fa-upload mr-2'} />
            Importer un projet
          </button>
        </div>
        {userAuthenticated && (
          <div className={'control-item'}>
            <button onClick={this.handleOpenProject} type={'button'} className={'btn btn-link'} data-cy={'open-remote-project'}>
              <i className={'fa fa-globe-europe mr-2'} /> Ouvrir un projet
            </button>
          </div>
        )}
        <div className={'control-item'}>
          <button onClick={this.handleNewProject} type={'button'} className={'btn btn-link'} data-cy={'new-project'}>
            <i className={'fa fa-file mr-2'} /> Nouveau projet
          </button>
        </div>
        {userAuthenticated && (
          <div className={'control-item'}>
            <button onClick={this.handleSaveProject} type={'button'} className={'btn btn-link'} data-cy={'save-project'}>
              <i className={'fa fa-pen-alt mr-2'} />
              Enregistrer en ligne
            </button>
          </div>
        )}
        <div className={'control-item'}>
          <button onClick={this.handleExportProject} type={'button'} className={'btn btn-link'} data-cy={'export-project'}>
            <i className={'fa fa-download mr-2'} />
            Exporter le projet
          </button>
        </div>

        {remoteProjectModal && <OpenRemoteProjectModal onHide={this.handleRemoteProjectModalHide} />}
      </div>
    );
  }

  private handleNewProject = () => {
    const { toasts, project, history } = this.props.services;

    project.newProject();
    history.clean();
    toasts.info('Nouveau projet créé');
  };

  private handleSaveProject = () => {
    const { toasts, project, geo, modals } = this.props.services;

    const save = async () => {
      let password: string | undefined;
      if (geo.getMainMap().containsCredentials()) {
        const event = await modals.projectPasswordModal();
        if (event.status === ModalStatus.Canceled) {
          return;
        }
        password = event.value;
      }

      toasts.info('Enregistrement en cours ...');
      const compressed = await project.exportCurrentProject(password);
      toasts.info('Projet enregistré !');

      return project.save(compressed);
    };

    save().catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  };

  private handleOpenProject = () => {
    this.setState({ remoteProjectModal: true });
  };

  private handleRemoteProjectModalHide = () => {
    this.setState({ remoteProjectModal: false });
  };

  private handleExportProject = () => {
    const { toasts, project, geo, modals } = this.props.services;

    const exportProject = async () => {
      let password: string | undefined;
      if (geo.getMainMap().containsCredentials()) {
        const event = await modals.projectPasswordModal();
        if (event.status === ModalStatus.Canceled) {
          return;
        }
        password = event.value;
      }

      toasts.info('Export en cours ...');
      const compressed = await project.exportCurrentProject(password);
      FileIO.output(URL.createObjectURL(compressed.project), `project.${Constants.EXTENSION}`);
      toasts.info('Export terminé !');
    };

    exportProject().catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  };

  private handleImportProject = () => {
    const { toasts, modals, project, history } = this.props.services;

    const importProject = async () => {
      const result = await FileIO.openInput(InputType.Single, '.abm2');

      if (InputResultType.Canceled === result.type) {
        return;
      }

      if (result.files.length !== 1) {
        return toasts.error('Vous devez sélectionner un fichier');
      }

      const file = result.files[0];
      if (!file.name.endsWith(Constants.EXTENSION)) {
        return toasts.error('Vous devez sélectionner un fichier au format abm2');
      }

      let password: string | undefined;
      if (await project.compressedContainsCredentials(file)) {
        const ev = await modals.projectPasswordModal();
        if (ev.status === ModalStatus.Canceled) {
          return;
        }
        password = ev.value;
      }

      toasts.info('Chargement ...');
      await project.loadProject(file, password);
      history.clean();
      toasts.info('Projet importé !');
    };

    importProject().catch((err) => {
      logger.error(err);
      toasts.genericError();
    });
  };
}

export default connector(withServices(ProjectControls));
