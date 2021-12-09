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

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { ServiceProps, withServices } from '../../../core/withServices';
import { Errors } from '../../../core/utils/Errors';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './RemoteProjectsModal.module.scss';
import { OperationStatus } from '../../../core/ui/typings';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';

const logger = Logger.get('RemoteProjectModal.tsx');

export interface LocalProps {
  onHide: () => void;
}

declare type Props = LocalProps & ServiceProps;

interface State {
  projects: AbcProjectMetadata[];
  selected?: AbcProjectMetadata;
  passwordValue: string;
  deleteConfirmation?: AbcProjectMetadata;
  message: string;
  loading: boolean;
}

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

class RemoteProjectsModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      projects: [],
      passwordValue: '',
      message: '',
      loading: false,
    };
  }

  public render(): ReactNode {
    const projects = this.state.projects;
    const selected = this.state.selected;
    const passwordValue = this.state.passwordValue;
    const deleteConfirmation = this.state.deleteConfirmation;
    const showCredentials = !deleteConfirmation && selected && selected.containsCredentials;
    const showButtons = !deleteConfirmation;
    const showModificationsWarning = !deleteConfirmation;
    const message = this.state.message;
    const loading = this.state.loading;

    return (
      <Modal show={true} onHide={this.props.onHide} backdrop={'static'} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Projects_saved')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-3'}>{t('Select_a_project')}:</div>

          {/* List of projects */}
          <div className={Cls.projectList}>
            {projects.map((pr) => {
              const isSelected = selected?.id === pr.id;
              const classes = isSelected ? `${Cls.item} ${Cls.selected}` : Cls.item;
              const hasCredentials = pr.containsCredentials;

              return (
                <div key={pr.id} className={classes}>
                  <div onClick={() => this.handleItemSelected(pr)} className={'flex-grow-1'} data-cy={'remote-project'}>
                    {pr.name} {hasCredentials && <FaIcon icon={IconDefs.faLock} className={'mx-2'} title={t('This_project_is_password_protected')} />}
                  </div>
                  <div onClick={() => this.handleDeleteProject(pr)} data-cy={'delete-project'}>
                    <FaIcon icon={IconDefs.faTrash} className={'mx-2'} title={t('Delete_project')} />
                  </div>
                </div>
              );
            })}
            {!projects.length && <div>{t('No_saved_project')}</div>}
          </div>

          {showModificationsWarning && (
            <div className={'my-3 alert alert-warning d-flex align-items-center justify-content-center'}>
              <FaIcon icon={IconDefs.faExclamationTriangle} className={'mr-2'} /> {t('Current_changes_will_be_lost')}
            </div>
          )}

          {/* Delete confirmation */}
          {deleteConfirmation && (
            <div className={`alert alert-danger ${Cls.deleteConfirmation} p-2`}>
              <div className={'mb-2 text-center'}>{t('Are_you_sure')} </div>
              <div className={'fw-bold text-center'}>{deleteConfirmation.name}</div>
              <div className={'d-flex justify-content-center align-items-center mt-4'}>
                <button onClick={this.handleDeleteCanceled} className={'btn btn-secondary mr-2'} disabled={loading}>
                  {t('Do_not_delete')}
                </button>
                <button onClick={this.handleDeleteConfirmed} className={'btn btn-danger'} disabled={loading} data-cy={'confirm-deletion'}>
                  {t('Delete_definitely')}
                </button>
              </div>
            </div>
          )}

          {/* Password prompt, if project is protected */}
          {showCredentials && (
            <div className={Cls.passwordInput}>
              <div>{t('This_project_is_protected_by_a_password')}:</div>
              <input
                type={'password'}
                onInput={this.handlePasswordInput}
                value={passwordValue}
                placeholder={t('Password_of_project')}
                className={'form-control'}
                data-cy={'project-password'}
              />
            </div>
          )}

          {/* Confirmation buttons */}
          {showButtons && (
            <>
              {/* Message if any */}
              {message && <div className={'my-3 d-flex justify-content-end'}>{message}</div>}

              <div className={'d-flex justify-content-end'}>
                <button onClick={this.handleCancel} disabled={loading} className={'btn btn-secondary mr-3'} data-cy={'cancel-button'}>
                  {t('Cancel')}
                </button>
                <button onClick={this.handleOpenProject} disabled={!selected || loading} className={'btn btn-primary'} data-cy="open-project-confirm">
                  {t('Open_project')}
                </button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    this.listProjects();
  }

  private listProjects() {
    const { project } = this.props.services;
    project
      .listRemoteProjects()
      .then((projects) => this.setState({ projects }))
      .catch((err) => logger.error('Cannot list projects: ', err));
  }

  private handlePasswordInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const passwordValue = ev.target.value;
    this.setState({ passwordValue });
  };

  private handleItemSelected = (pr: AbcProjectMetadata) => this.setState({ selected: pr });

  private handleDeleteProject = (pr: AbcProjectMetadata) => this.setState({ deleteConfirmation: pr });

  private handleDeleteCanceled = () => this.setState({ deleteConfirmation: undefined });

  private handleDeleteConfirmed = () => {
    const { toasts, project } = this.props.services;
    const id = this.state.deleteConfirmation?.id;
    if (!id) {
      toasts.genericError();
      return;
    }

    this.setState({ loading: true });

    project
      .deleteById(id)
      .then(() => {
        toasts.info(t('Project_deleted'));
        this.setState({ selected: undefined, deleteConfirmation: undefined });
        this.listProjects();
      })
      .catch((err) => logger.error('Cannot delete project: ', err))
      .finally(() => this.setState({ loading: false }));
  };

  private handleCancel = () => this.props.onHide();

  private handleOpenProject = () => {
    const { project, toasts, modals } = this.props.services;

    this.setState({ loading: true });

    const loadProject = async () => {
      const selected = this.state.selected;
      const passwordValue = this.state.passwordValue;
      if (!selected) {
        toasts.info(t('You_must_select_a_project'));
        return OperationStatus.Interrupted;
      }

      if (selected.containsCredentials && !passwordValue) {
        toasts.info(t('You_must_enter_a_password'));
        return OperationStatus.Interrupted;
      }

      await project.loadRemoteProject(selected.id, passwordValue);
      toasts.info('Projet ouvert !');
      this.props.onHide();

      return OperationStatus.Succeed;
    };

    modals
      .longOperationModal(loadProject)
      .catch((err) => {
        logger.error('Cannot open project: ', err);

        if (Errors.isWrongPassword(err) || Errors.isMissingPassword(err)) {
          this.setState({ message: t('Incorrect_password') });
        } else {
          toasts.genericError();
        }
      })
      .finally(() => this.setState({ loading: false }));
  };
}

export default withTranslation()(withServices(RemoteProjectsModal));
