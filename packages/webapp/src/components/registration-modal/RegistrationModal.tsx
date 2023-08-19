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
import { Logger } from '@abc-map/shared';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { Modal } from 'react-bootstrap';
import RegistrationForm, { FormValues } from './RegistrationForm';
import RegistrationDone from './RegistrationDone';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { AuthenticationError, ErrorType } from '../../core/authentication/AuthenticationError';

const logger = Logger.get('RegistrationModal.tsx');

interface State {
  visible: boolean;
  registrationDone: boolean;
}

const t = prefixedTranslation('RegistrationModal:');

class RegistrationModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      registrationDone: false,
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const registrationDone = this.state.registrationDone;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Registration')} 🪶</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column p-3`}>
            {!registrationDone && <RegistrationForm onSubmit={this.handleSubmit} onCancel={this.handleCancel} />}
            {registrationDone && <RegistrationDone onConfirm={this.handleConfirm} />}
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowRegistration, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowRegistration, this.handleOpen);
  }

  private handleOpen = () => {
    this.setState({ visible: true, registrationDone: false });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.RegistrationClosed,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false });
  };

  private handleSubmit = ({ email, password }: FormValues) => {
    const { authentication, toasts } = this.props.services;

    authentication
      .registration(email, password)
      .then(() => this.setState({ registrationDone: true }))
      .catch((err) => {
        logger.error('Registration error: ', err);

        if (err instanceof AuthenticationError && err.type === ErrorType.EmailAlreadyInUse) {
          toasts.error(t('This_email_address_is_already_in_use'));
        } else {
          toasts.genericError(err);
        }
      });
  };

  private handleConfirm = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.RegistrationClosed,
      status: ModalStatus.Confirmed,
    });

    this.setState({ visible: false });
  };
}

export default withTranslation()(withServices(RegistrationModal));
