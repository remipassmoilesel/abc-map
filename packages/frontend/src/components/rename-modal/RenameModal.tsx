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
import { Modal } from 'react-bootstrap';
import { ModalEventType, ModalStatus, ShowRenameModal } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';

interface State {
  visible: boolean;
  title: string;
  message: string;
  value: string;
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
    const visible = this.state.visible;
    const title = this.state.title;
    const message = this.state.message;
    const value = this.state.value;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{message}</div>
          <div className={'m-3'}>
            <input className={'form-control'} type={'text'} value={value} onChange={this.handleInputChanged} data-cy="modal-rename-input" />
          </div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="rename-modal-confirm">
              Renommer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowRename, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowRename, this.handleOpen);
  }

  private handleOpen = (ev: ShowRenameModal) => {
    this.setState({ visible: true, title: ev.title, message: ev.message, value: ev.value });
  };

  private handleInputChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: ev.target.value });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.RenameClosed,
      value: this.state.value,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false });
  };

  private handleConfirm = () => {
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
