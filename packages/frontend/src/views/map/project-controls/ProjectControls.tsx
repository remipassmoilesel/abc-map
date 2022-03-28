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
import { Logger, ProjectConstants, UserStatus } from '@abc-map/shared';
import { connect, ConnectedProps } from 'react-redux';
import { MainState } from '../../../core/store/reducer';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import RemoteProjectsModal from './remote-projects-modal/RemoteProjectsModal';
import { ModalStatus, OperationStatus } from '../../../core/ui/typings';
import { ServiceProps, withServices } from '../../../core/withServices';
import { Errors } from '../../../core/utils/Errors';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import { ProjectStatus } from '../../../core/project/ProjectStatus';
import { saveProjectOnline } from '../../../core/project/useSaveProjectOnline';

export const logger = Logger.get('ProjectControls.tsx');

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

const t = prefixedTranslation('MapView:ProjectControls.');

class ProjectControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { remoteProjectModal: false };
  }

  public render(): ReactNode {
    const remoteProjectsModal = this.state.remoteProjectModal;
    const userAuthenticated = this.props.userStatus === UserStatus.Authenticated;

    return (
      <div className={'control-block'}>
        {userAuthenticated && (
          <>
            <div className={'control-item'}>
              <button onClick={this.handleOpenProject} type={'button'} className={'btn btn-link'} data-cy={'remote-projects'}>
                <FaIcon icon={IconDefs.faGlobeEurope} className={'mr-2'} />
                {t('My_projects')}
              </button>
            </div>
            <div className={'control-item'}>
              <button onClick={this.handleSaveProject} type={'button'} className={'btn btn-link'} data-cy={'save-project'} data-testid={'save-project'}>
                <FaIcon icon={IconDefs.faPenAlt} className={'mr-2'} />
                {t('Save_online')}
              </button>
            </div>
            <hr />
          </>
        )}

        <div className={'control-item'}>
          <button onClick={this.handleNewProject} type={'button'} className={'btn btn-link'} data-cy={'new-project'} data-testid={'new-project'}>
            <FaIcon icon={IconDefs.faFile} className={'mr-2'} /> {t('New_project')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.handleExportProject} type={'button'} className={'btn btn-link'} data-cy={'export-project'} data-testid={'export-project'}>
            <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
            {t('Export_project')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.handleImportProject} type={'button'} className={'btn btn-link'} data-cy={'import-project'}>
            <FaIcon icon={IconDefs.faUpload} className={'mr-2'} />
            {t('Import_project')}
          </button>
        </div>

        {remoteProjectsModal && <RemoteProjectsModal onHide={this.handleRemoteProjectModalHide} />}
      </div>
    );
  }

  private handleNewProject = () => {
    const { modals, toasts, project } = this.props.services;

    modals
      .modificationsLostConfirmation()
      .then((res) => {
        if (ModalStatus.Confirmed === res) {
          return project.newProject().then(() => toasts.info(t('New_project_created')));
        }
      })
      .catch((err) => logger.error('Confirmation error: ', err));
  };

  private handleSaveProject = () => {
    saveProjectOnline(this.props.services).catch((err) => logger.error('Cannot save project: ', err));
  };

  private handleOpenProject = () => {
    this.setState({ remoteProjectModal: true });
  };

  private handleRemoteProjectModalHide = () => {
    this.setState({ remoteProjectModal: false });
  };

  private handleExportProject = () => {
    const { toasts, project, modals } = this.props.services;

    const exportProject = async () => {
      const compressed = await project.exportCurrentProject();
      if (ProjectStatus.Canceled === compressed) {
        return OperationStatus.Interrupted;
      }

      FileIO.outputBlob(compressed.project, `projet${ProjectConstants.FileExtension}`);
      return OperationStatus.Succeed;
    };

    const firstToast = toasts.info(t('Export_in_progress'));
    exportProject()
      .then((status) => {
        if (status === OperationStatus.Succeed) {
          toasts.dismiss(firstToast);
          toasts.info(t('Export_done'));
          return modals.solicitation();
        }
      })
      .catch((err) => {
        logger.error('Cannot export project: ', err);
        toasts.genericError();
        toasts.dismiss(firstToast);
      });
  };

  private handleImportProject = () => {
    const { toasts, project, modals } = this.props.services;

    const selectProject = async (): Promise<File | undefined> => {
      const result = await FileIO.openInput(InputType.Single, ProjectConstants.InputFileExtensions);

      if (InputResultType.Canceled === result.type) {
        return;
      }

      if (result.files.length !== 1) {
        toasts.error(t('You_must_select_a_file'));
        return;
      }

      const file = result.files[0];
      if (!file.name.endsWith(ProjectConstants.FileExtension)) {
        toasts.error(t('You_must_select_a_file_with_extension_', { extension: ProjectConstants.FileExtension }));
        return;
      }

      return file;
    };

    const importProject = async (file: File) => {
      await project.loadBlobProject(file);
      toasts.info(t('Project_loaded'));

      return OperationStatus.Succeed;
    };

    let firstToast = '';
    modals
      .modificationsLostConfirmation()
      .then((res) => {
        if (ModalStatus.Confirmed === res) {
          return selectProject();
        }
      })
      .then((file) => {
        if (file) {
          firstToast = toasts.info(t('Opening_in_progress'));
          return importProject(file);
        }
      })
      .catch((err) => {
        logger.error('Cannot import project: ', err);

        if (Errors.isWrongPassword(err)) {
          toasts.error(t('Incorrect_password'));
        } else if (Errors.isMissingPassword(err)) {
          toasts.error(t('Password_is_mandatory'));
        } else {
          toasts.genericError();
        }
      })
      .finally(() => toasts.dismiss(firstToast));
  };
}

export default withTranslation()(connector(withServices(ProjectControls)));
