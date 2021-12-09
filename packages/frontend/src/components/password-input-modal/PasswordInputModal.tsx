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
import { ModalEventType, ModalStatus, ShowPasswordInputModal } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import FormValidationLabel from '../form-validation-label/FormValidationLabel';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';
import { FormState } from '../form-validation-label/FormState';
import { Encryption } from '../../core/utils/Encryption';
import { Errors } from '../../core/utils/Errors';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('PasswordInputModal.tsx');

interface State {
  visible: boolean;
  title: string;
  message: string;
  value: string;
  witness: string;
  formState: FormState;
}

const t = prefixedTranslation('PasswordInputModal:');

class PasswordInputModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
      value: '',
      witness: '',
      formState: FormState.InvalidPassword,
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const title = this.state.title;
    const message = this.state.message;
    if (!visible) {
      return <div />;
    }

    const value = this.state.value;
    const formState = this.state.formState;
    const submitDisabled = formState !== FormState.Ok;

    return (
      <Modal show={visible} onHide={this.handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'p-3'}>
            <div className={'mb-3'}>{message}</div>

            <div className={'mb-3'}>
              <input
                className={'form-control'}
                type={'password'}
                value={value}
                placeholder={t('Password')}
                onChange={this.handleInputChange}
                data-cy="password-input"
                data-testid="password-input"
              />
            </div>

            <FormValidationLabel state={formState} className={'mb-3'} />

            <div className={'d-flex justify-content-end'}>
              <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel} data-cy="password-cancel" data-testid={'password-cancel'}>
                {t('Cancel')}
              </button>
              <button
                className={'btn btn-primary'}
                onClick={this.handleConfirm}
                disabled={submitDisabled}
                data-cy="password-confirm"
                data-testid={'password-confirm'}
              >
                {t('Confirm')}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowPasswordInput, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowPasswordInput, this.handleOpen);
  }

  private handleOpen = (ev: ShowPasswordInputModal) => {
    this.setState({ visible: true, title: ev.title, message: ev.message, witness: ev.witness, formState: FormState.PasswordTooWeak });
  };

  private handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    const formState = this.validateForm(value);
    this.setState({ value, formState });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.PasswordInputClosed,
      value: '',
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false, value: '' });
  };

  private handleConfirm = () => {
    const { modals, toasts } = this.props.services;
    const { witness, value } = this.state;

    const formState = this.validateForm(this.state.value);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    Encryption.decrypt(witness, value)
      .then(() => {
        modals.dispatch({
          type: ModalEventType.PasswordInputClosed,
          value: this.state.value,
          status: ModalStatus.Confirmed,
        });

        this.setState({ visible: false, value: '' });
      })
      .catch((err) => {
        if (Errors.isWrongPassword(err)) {
          this.setState({ formState: FormState.IncorrectPassword });
        } else {
          logger.error('Unhandled encryption error: ', err);
          toasts.genericError();

          modals.dispatch({
            type: ModalEventType.PasswordInputClosed,
            value: '',
            status: ModalStatus.Canceled,
          });

          this.setState({ visible: false, value: '' });
        }
      });
  };

  private validateForm(password: string): FormState {
    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.InvalidPassword;
    }

    return FormState.Ok;
  }
}

export default withServices(PasswordInputModal);
