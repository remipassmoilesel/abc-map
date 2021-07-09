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
import { Errors } from '../../../core/utils/Errors';

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
    const { toasts, project } = this.props.services;

    project.newProject();
    toasts.info('Nouveau projet créé');
  };

  private handleSaveProject = () => {
    const { toasts, project, geo, modals } = this.props.services;

    const save = async () => {
      let password: string | undefined;
      if (geo.getMainMap().containsCredentials()) {
        const event = await modals.setProjectPassword();
        if (event.status === ModalStatus.Canceled) {
          return;
        }
        password = event.value;
      }

      const compressed = await project.exportCurrentProject(password);
      if (compressed.project.size >= ProjectConstants.MaxSizeBytes) {
        toasts.error("Désolé 😞 ce projet est trop gros pour être sauvegardé en ligne. Vous pouvez l'exporter sur votre ordinateur.");
        return;
      }

      await project.save(compressed);
      toasts.info('Projet enregistré !');
    };

    modals
      .longOperationModal(save)
      .then(() => modals.solicitation())
      .catch((err) => {
        logger.error('Cannot save project: ', err);
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
        const event = await modals.setProjectPassword();
        if (event.status === ModalStatus.Canceled) {
          return;
        }
        password = event.value;
      }

      const compressed = await project.exportCurrentProject(password);
      FileIO.outputBlob(compressed.project, `project.${Constants.EXTENSION}`);
      toasts.info('Export terminé !');
    };

    modals
      .longOperationModal(exportProject)
      .then(() => modals.solicitation())
      .catch((err) => {
        logger.error('Cannot export project: ', err);
        toasts.genericError();
      });
  };

  private handleImportProject = () => {
    const { toasts, project, modals } = this.props.services;

    const selectProject = async (): Promise<File | undefined> => {
      const result = await FileIO.openInput(InputType.Single, '.abm2');

      if (InputResultType.Canceled === result.type) {
        return;
      }

      if (result.files.length !== 1) {
        toasts.error('Vous devez sélectionner un fichier');
        return;
      }

      const file = result.files[0];
      if (!file.name.endsWith(Constants.EXTENSION)) {
        toasts.error('Vous devez sélectionner un fichier au format abm2');
        return;
      }

      return file;
    };

    const importProject = async (file: File) => {
      await project.loadProject(file);
      toasts.info('Projet importé !');
    };

    selectProject()
      .then((file) => {
        if (file) {
          return modals.longOperationModal(() => importProject(file));
        }
      })
      .catch((err) => {
        logger.error('Cannot import project: ', err);

        if (Errors.isWrongPassword(err)) {
          toasts.error('Mot de passe incorrect !');
        } else if (Errors.isMissingPassword(err)) {
          toasts.error('Le mot de passe est obligatoire pour ouvrir ce projet');
        } else {
          toasts.genericError();
        }
      });
  };
}

export default connector(withServices(ProjectControls));
