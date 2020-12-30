import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { services } from '../../../core/Services';

interface Props {
  project: AbcProjectMetadata;
}

interface State {
  renameModal: boolean;
  inputName: string;
}

class ProjectStatus extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      renameModal: false,
      inputName: '',
    };
  }

  public render(): ReactNode {
    const metadata = this.props.project;
    return (
      <div className={'control-block d-flex flex-column'}>
        <div className={'control-item d-flex flex-column'}>
          <div data-cy="project-name">{metadata.name}</div>
          <div>Projection: {metadata.projection.name}</div>
          <div>
            <button className={'btn btn-link'} onClick={this.showRenameModal} data-cy="rename-project">
              Renommer
            </button>
          </div>
        </div>
        <Modal show={this.state.renameModal} onHide={this.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Titre du projet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Renommer le projet:</div>
            <div className={'m-3'}>
              <input className={'form-control'} type={'text'} value={this.state.inputName} onChange={this.onInputTitleChanged} data-cy="project-name-input" />
            </div>
            <div className={'d-flex justify-content-end'}>
              <button className={'btn btn-secondary mr-3'} onClick={this.onCancel}>
                Annuler
              </button>
              <button className={'btn btn-primary'} onClick={this.onRename} data-cy="confirm-rename">
                Renommer
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  private onInputTitleChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputName: ev.target.value });
  };

  private showRenameModal = () => {
    this.setState({ renameModal: true, inputName: this.props.project.name });
  };

  private onCancel = () => {
    this.setState({ renameModal: false, inputName: '' });
  };

  private onClose = () => {
    this.setState({ renameModal: false });
  };

  private onRename = () => {
    this.services.project.renameProject(this.state.inputName);
    this.setState({ renameModal: false });
  };
}

export default ProjectStatus;
