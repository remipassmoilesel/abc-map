/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component, ReactNode } from 'react';
import { ProjectConstants, UserStatus } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { Constants } from '../../../core/Constants';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../core/store/reducer';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import RemoteProjectModal from './RemoteProjectsModal';
import { ModalStatus } from '../../../core/ui/typings';
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
        {userAuthenticated && (
          <>
            <div className={'control-item'}>
              <button onClick={this.handleOpenProject} type={'button'} className={'btn btn-link'} data-cy={'remote-projects'}>
                <i className={'fa fa-globe-europe mr-2'} /> Ouvrir un projet
              </button>
            </div>
            <div className={'control-item'}>
              <button onClick={this.handleSaveProject} type={'button'} className={'btn btn-link'} data-cy={'save-project'}>
                <i className={'fa fa-pen-alt mr-2'} />
                Enregistrer en ligne
              </button>
            </div>
            <hr />
          </>
        )}

        <div className={'control-item'}>
          <button onClick={this.handleNewProject} type={'button'} className={'btn btn-link'} data-cy={'new-project'}>
            <i className={'fa fa-file mr-2'} /> Nouveau projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.handleImportProject} type={'button'} className={'btn btn-link'} data-cy={'import-project'}>
            <i className={'fa fa-upload mr-2'} />
            Importer un projet
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.handleExportProject} type={'button'} className={'btn btn-link'} data-cy={'export-project'}>
            <i className={'fa fa-download mr-2'} />
            Exporter le projet
          </button>
        </div>

        {remoteProjectModal && <RemoteProjectModal onHide={this.handleRemoteProjectModalHide} />}
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
        const event = await modals.projectPassword();
        if (event.status === ModalStatus.Canceled) {
          return;
        }
        password = event.value;
      }

      toasts.info('Enregistrement en cours ...');
      const compressed = await project.exportCurrentProject(password);
      if (compressed.project.size >= ProjectConstants.MaxSizeBytes) {
        toasts.error("Désolé 😞 ce projet est trop gros. Mais vous pouvez l'exporter.");
        return;
      }

      await project.save(compressed);
      toasts.info('Projet enregistré !');
    };

    modals
      .solicitation()
      .then(() => save())
      .catch((err) => {
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
        const event = await modals.projectPassword();
        if (event.status === ModalStatus.Canceled) {
          return;
        }
        password = event.value;
      }

      toasts.info('Export en cours ...');
      const compressed = await project.exportCurrentProject(password);
      FileIO.outputBlob(compressed.project, `project.${Constants.EXTENSION}`);
      toasts.info('Export terminé !');
    };

    modals
      .solicitation()
      .then(() => exportProject())
      .catch((err) => {
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

      toasts.info('Chargement ...');

      let password: string | undefined;
      if (await project.compressedContainsCredentials(file)) {
        const ev = await modals.projectPassword();
        if (ev.status === ModalStatus.Canceled) {
          return;
        }
        password = ev.value;
      }

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