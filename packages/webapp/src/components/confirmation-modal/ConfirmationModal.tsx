/**
 * Copyright © 2023 Rémi Pace.
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
import { Modal } from 'react-bootstrap';
import { ModalEventType, ModalStatus, ShowConfirmationModalEvent } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';

interface State {
  visible: boolean;
  title: string;
  message: string;
}

const t = prefixedTranslation('ConfirmationModal:');

class ConfirmationModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const title = this.state.title;
    const message = this.state.message;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: message }} />

          <div className={'mt-4 d-flex justify-content-end'}>
            <button onClick={this.handleCancel} className={'btn btn-secondary mr-2'} data-cy={'confirmation-cancel'}>
              {t('Cancel')}
            </button>
            <button onClick={this.handleConfirm} className={'btn btn-primary'} data-cy={'confirmation-confirm'}>
              {t('Confirm')}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowConfirmation, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowConfirmation, this.handleOpen);
  }

  private handleOpen = (ev: ShowConfirmationModalEvent) => {
    this.setState({ visible: true, title: ev.title, message: ev.message });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.ConfirmationClosed,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false, title: '', message: '' });
  };

  private handleConfirm = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.ConfirmationClosed,
      status: ModalStatus.Confirmed,
    });

    this.setState({ visible: false, title: '', message: '' });
  };
}

export default withTranslation()(withServices(ConfirmationModal));
