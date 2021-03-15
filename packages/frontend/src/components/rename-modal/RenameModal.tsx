import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { ModalEventListener, ModalEventType, ModalStatus } from '../../core/ui/Modals.types';
import { ServiceProps, withServices } from '../../core/withServices';

interface State {
  visible: boolean;
  title: string;
  message: string;
  value: string;
  listener?: ModalEventListener;
}

class RenameModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
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
      <Modal show={this.state.visible} onHide={this.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{this.state.message}</div>
          <div className={'m-3'}>
            <input className={'form-control'} type={'text'} value={this.state.value} onChange={this.onInputChanged} data-cy="modal-rename-input" />
          </div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.onCancel}>
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.onRename} data-cy="modal-rename-confirm">
              Renommer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    const listener: ModalEventListener = (ev) => {
      if (ev.type === ModalEventType.ShowRename) {
        this.setState({ visible: true, title: ev.title, message: ev.message, value: ev.value });
      }
    };
    modals.addListener(ModalEventType.ShowRename, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    if (this.state.listener) {
      modals.removeListener(ModalEventType.ShowRename, this.state.listener);
    }
  }

  private onInputChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: ev.target.value });
  };

  private onCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.RenameClosed,
      value: this.state.value,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false });
  };

  private onRename = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.RenameClosed,
      value: this.state.value,
      status: ModalStatus.Confirmed,
    });

    this.setState({ visible: false });
  };
}

export default withServices(RenameModal);
