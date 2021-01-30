import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { ModalEventListener, ModalEventType, ModalStatus } from '../../core/ui/Modals.types';
import { services } from '../../core/Services';

interface State {
  visible: boolean;
  title: string;
  message: string;
  value: string;
  listener?: ModalEventListener;
}

class PasswordModal extends Component<{}, State> {
  private services = services();

  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
      value: '',
    };
  }

  public render(): ReactNode {
    if (!this.state.visible) {
      return <div />;
    }

    return (
      <Modal show={this.state.visible} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{this.state.message}</div>
          <div className={'m-3'}>
            <input className={'form-control'} type={'password'} value={this.state.value} onChange={this.handleInputChange} data-cy="modal-password-input" />
          </div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel} data-cy="modal-password-cancel">
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="modal-password-confirm">
              Confirmer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const listener: ModalEventListener = (ev) => {
      if (ev.type === ModalEventType.ShowPassword) {
        this.setState({ visible: true, title: ev.title, message: ev.message });
      }
    };
    this.services.ui.modals.addListener(ModalEventType.ShowPassword, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    if (this.state.listener) {
      this.services.ui.modals.removeListener(ModalEventType.ShowPassword, this.state.listener);
    }
  }

  private handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: ev.target.value });
  };

  private handleCancel = () => {
    this.services.ui.modals.dispatch({
      type: ModalEventType.PasswordClosed,
      value: this.state.value,
      status: ModalStatus.Canceled,
    });
    this.setState({ visible: false, value: '' });
  };

  private handleConfirm = () => {
    this.services.ui.modals.dispatch({
      type: ModalEventType.PasswordClosed,
      value: this.state.value,
      status: ModalStatus.Confirmed,
    });
    this.setState({ visible: false, value: '' });
  };
}

export default PasswordModal;
