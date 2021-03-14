import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { Logger } from '@abc-map/frontend-shared';
import { Modal } from 'react-bootstrap';
import Cls from './OpenRemoteProjectModal.module.scss';

const logger = Logger.get('OpenRemoteModal.tsx');

interface State {
  projects: AbcProjectMetadata[];
  selected?: AbcProjectMetadata;
}

export interface Props {
  onHide: () => void;
}

class OpenRemoteProjectModal extends Component<Props, State> {
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
      <Modal show={true} onHide={this.props.onHide} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Ouvrir un projet distant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-3'}>Sélectionnez un projet: </div>
          <div className={Cls.recentProjects} data-cy={'recent-projects'}>
            {projects.map((pr) => {
              const selected = this.state.selected?.id === pr.id;
              const classes = selected ? `${Cls.item} ${Cls.selected}` : Cls.item;
              return (
                <div key={pr.id} className={classes} onClick={() => this.selectItem(pr)}>
                  {pr.name}
                </div>
              );
            })}
          </div>
          <div className={'font-weight-bold my-3'}>Attention: l&apos;ouverture du projet effacera le projet en cours</div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="modal-rename-confirm">
              Ouvrir le projet
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    this.services.project
      .list()
      .then((projects) => this.setState({ projects }))
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  }

  public selectItem = (pr: AbcProjectMetadata) => {
    this.setState({ selected: pr });
  };

  public handleCancel = () => {
    this.props.onHide();
  };

  public handleConfirm = () => {
    const selected = this.state.selected;
    if (!selected) {
      this.services.toasts.info('Vous devez sélectionner un projet.');
      return;
    }

    this.services.project
      .loadRemoteProject(selected.id)
      .then(() => {
        this.services.history.clean();
        this.services.toasts.info('Projet ouvert !');
        this.props.onHide();
      })
      .catch((err) => {
        this.services.toasts.genericError();
        logger.error(err);
      });
  };
}

export default OpenRemoteProjectModal;
