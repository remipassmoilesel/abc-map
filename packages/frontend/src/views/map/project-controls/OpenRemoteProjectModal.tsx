import React, { ChangeEvent, Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { Logger } from '@abc-map/frontend-shared';
import { Modal } from 'react-bootstrap';
import Cls from './OpenRemoteProjectModal.module.scss';

const logger = Logger.get('OpenRemoteModal.tsx');

interface State {
  projects: AbcProjectMetadata[];
  selected?: AbcProjectMetadata;
  passwordValue: string;
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
      passwordValue: '',
    };
  }

  public render(): ReactNode {
    const projects = this.state.projects;
    const selected = this.state.selected;
    const passwordValue = this.state.passwordValue;
    const showCredentials = selected && selected.containsCredentials;

    return (
      <Modal show={true} onHide={this.props.onHide} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Ouvrir un projet distant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-3'}>Sélectionnez un projet: </div>
          <div className={Cls.recentProjects}>
            {projects.map((pr) => {
              const isSelected = selected?.id === pr.id;
              const classes = isSelected ? `${Cls.item} ${Cls.selected}` : Cls.item;
              const hasCredentials = pr.containsCredentials;

              return (
                <div key={pr.id} className={classes} onClick={() => this.selectItem(pr)} data-cy={'remote-project'}>
                  {pr.name} {hasCredentials && <i className={'fa fa-lock'} />}
                </div>
              );
            })}
          </div>
          {showCredentials && (
            <div className={Cls.passwordInput}>
              <div>Ce projet est protégé par un mot de passe:</div>
              <input type={'password'} onInput={this.handlePasswordInput} value={passwordValue} className={'form-control'} data-cy={'project-password'} />
            </div>
          )}
          <div className={'font-weight-bold my-3'}>Attention: l&apos;ouverture du projet effacera le projet en cours</div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="open-project-confirm">
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

  public handlePasswordInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const passwordValue = ev.target.value;
    this.setState({ passwordValue });
  };

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

    const passwordValue = this.state.passwordValue;
    if (selected.containsCredentials && !passwordValue) {
      this.services.toasts.info('Vous devez entrer un mot de passe');
      return;
    }

    this.services.project
      .loadRemoteProject(selected.id, passwordValue)
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
