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
import Cls from './RemoteProjectModal.module.scss';

const logger = Logger.get('RemoteProjectModal.tsx');

interface State {
  projects: AbcProjectMetadata[];
  selected?: AbcProjectMetadata;
  passwordValue: string;
  deleteConfirmation?: AbcProjectMetadata;
}

export interface LocalProps {
  onHide: () => void;
}

declare type Props = LocalProps & ServiceProps;

class RemoteProjectModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      projects: [],
      passwordValue: '',
    };
  }

  public render(): ReactNode {
    const projects = this.state.projects;
    const selected = this.state.selected;
    const passwordValue = this.state.passwordValue;
    const deleteConfirmation = this.state.deleteConfirmation;
    const showCredentials = !deleteConfirmation && selected && selected.containsCredentials;
    const showButtons = !deleteConfirmation;

    return (
      <Modal show={true} onHide={this.props.onHide} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Projet enregistrés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-3'}>Sélectionnez un projet: </div>
          <div className={Cls.recentProjects}>
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
          </div>

          {deleteConfirmation && (
            <div className={`alert alert-danger ${Cls.deleteConfirmation}`}>
              <div className={'my-2'}>Êtes vous sur de vouloir supprimer &apos;{deleteConfirmation.name}&apos; ?</div>
              <div className={'my-2'}>
                <b>Attention: cette opération ne peut PAS être annulée. </b>
              </div>
              <div className={'d-flex justify-content-end align-items-center mt-4'}>
                <button className={'btn btn-secondary mr-2'} onClick={this.handleDeleteCanceled}>
                  Non
                </button>
                <button className={'btn btn-danger'} onClick={this.handleDeleteConfirmed} data-cy={'confirm-deletion'}>
                  Oui, supprimer définitivement
                </button>
              </div>
            </div>
          )}

          {showCredentials && (
            <div className={Cls.passwordInput}>
              <div>Ce projet est protégé par un mot de passe:</div>
              <input type={'password'} onInput={this.handlePasswordInput} value={passwordValue} className={'form-control'} data-cy={'project-password'} />
            </div>
          )}

          {showButtons && (
            <>
              <div className={'font-weight-bold my-3'}>Attention: l&apos;ouverture du projet effacera le projet en cours</div>
              <div className={'d-flex justify-content-end'}>
                <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
                  Annuler
                </button>
                <button className={'btn btn-primary'} onClick={this.handleConfirm} disabled={!selected} data-cy="open-project-confirm">
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
    const { project, toasts } = this.props.services;
    project
      .list()
      .then((projects) => this.setState({ projects }))
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
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

    project
      .deleteById(id)
      .then(() => {
        toasts.info('Project supprimé !');
        this.setState({ selected: undefined, deleteConfirmation: undefined });
        this.listProjects();
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  private handleCancel = () => this.props.onHide();

  private handleConfirm = () => {
    const { project, toasts, history } = this.props.services;

    const loadProject = async () => {
      const selected = this.state.selected;
      if (!selected) {
        toasts.info('Vous devez sélectionner un projet.');
        return;
      }

      const passwordValue = this.state.passwordValue;
      if (selected.containsCredentials && !passwordValue) {
        toasts.info('Vous devez entrer un mot de passe');
        return;
      }

      await project.loadRemoteProject(selected.id, passwordValue);
      history.clean();
      toasts.info('Projet ouvert !');
      this.props.onHide();
    };

    loadProject().catch((err) => {
      toasts.genericError();
      logger.error(err);
    });
  };
}

export default withServices(RemoteProjectModal);
