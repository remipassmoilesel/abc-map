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
import Cls from './RemoteProjectsModal.module.scss';

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
      <Modal show={true} onHide={this.props.onHide} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Projets enregistrés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-3'}>Sélectionnez un projet: </div>

          {/* List of projects */}
          <div className={Cls.projectList}>
            {projects.map((pr) => {
              const isSelected = selected?.id === pr.id;
              const classes = isSelected ? `${Cls.item} ${Cls.selected}` : Cls.item;
              const hasCredentials = pr.containsCredentials;

              return (
                <div key={pr.id} className={classes}>
                  <div onClick={() => this.handleItemSelected(pr)} className={'flex-grow-1'} data-cy={'remote-project'}>
                    {pr.name} {hasCredentials && <i className={'fa fa-lock mx-2'} />}
                  </div>
                  <div onClick={() => this.handleDeleteProject(pr)} data-cy={'delete-project'}>
                    <i title={'Supprimer le projet'} className={'fa fa-trash mx-2'} />
                  </div>
                </div>
              );
            })}
            {!projects.length && <div>Aucun projet enregistré.</div>}
          </div>

          {showModificationsWarning && (
            <div className={'my-3 alert alert-danger d-flex align-items-center justify-content-center'}>
              <i className={'fa fa-exclamation-triangle mr-2'} /> Les modifications en cours seront perdues !
            </div>
          )}

          {/* Delete confirmation */}
          {deleteConfirmation && (
            <div className={`alert alert-danger ${Cls.deleteConfirmation} p-2`}>
              <div className={'mb-2 text-center'}>Etes vous sur ? Vous allez supprimer définitivement: </div>
              <div className={'font-weight-bold text-center'}>{deleteConfirmation.name}</div>
              <div className={'d-flex justify-content-center align-items-center mt-4'}>
                <button onClick={this.handleDeleteCanceled} className={'btn btn-secondary mr-2'} disabled={loading}>
                  Ne pas supprimer
                </button>
                <button onClick={this.handleDeleteConfirmed} className={'btn btn-danger'} disabled={loading} data-cy={'confirm-deletion'}>
                  Supprimer définitivement
                </button>
              </div>
            </div>
          )}

          {/* Password prompt, if project is protected */}
          {showCredentials && (
            <div className={Cls.passwordInput}>
              <div>Ce projet est protégé par un mot de passe:</div>
              <input
                type={'password'}
                onInput={this.handlePasswordInput}
                value={passwordValue}
                placeholder={'Mot de passe du projet'}
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
                  Annuler
                </button>
                <button onClick={this.handleOpenProject} disabled={!selected || loading} className={'btn btn-primary'} data-cy="open-project-confirm">
                  Ouvrir le projet
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
        toasts.info('Project supprimé !');
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
        toasts.info('Vous devez sélectionner un projet.');
        return;
      }

      if (selected.containsCredentials && !passwordValue) {
        toasts.info('Vous devez entrer un mot de passe');
        return;
      }

      await project.loadRemoteProject(selected.id, passwordValue);
      toasts.info('Projet ouvert !');
      this.props.onHide();
    };

    modals
      .longOperationModal(loadProject)
      .catch((err) => {
        logger.error('Cannot open project: ', err);

        if (Errors.isWrongPassword(err) || Errors.isMissingPassword(err)) {
          this.setState({ message: 'Mot de passe incorrect.' });
        } else {
          toasts.genericError();
        }
      })
      .finally(() => this.setState({ loading: false }));
  };
}

export default withServices(RemoteProjectsModal);
