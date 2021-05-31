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
import { ModalEventListener, ModalEventType, ModalStatus, ShowSetPasswordModal } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import FormValidationLabel, { FormState } from '../form-state-label/FormValidationLabel';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';

interface State {
  visible: boolean;
  title: string;
  message: string;
  password: string;
  confirmation: string;
  formState: FormState;
  listener?: ModalEventListener<ShowSetPasswordModal>;
}

class SetPasswordModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
      password: '',
      confirmation: '',
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

    const password = this.state.password;
    const confirmation = this.state.confirmation;
    const formState = this.state.formState;
    const submitDisabled = formState !== FormState.Ok;

    return (
      <Modal show={visible} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{message}</div>
          <div className={'m-3'}>
            <input
              className={'form-control'}
              type={'password'}
              placeholder={'Mot de passe'}
              value={password}
              onChange={this.handlePasswordChange}
              data-cy="password-input"
              data-testid={'password-input'}
            />
          </div>
          <div className={'m-3'}>
            <input
              className={'form-control'}
              type={'password'}
              placeholder={'Confirmation'}
              value={confirmation}
              onChange={this.handleConfirmationChange}
              data-cy="password-confirmation"
              data-testid={'password-confirmation'}
            />
          </div>

          <FormValidationLabel state={formState} />

          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel} data-cy="password-cancel" data-testid={'password-cancel'}>
              Annuler
            </button>
            <button
              className={'btn btn-primary'}
              onClick={this.handleConfirm}
              disabled={submitDisabled}
              data-cy="password-confirm"
              data-testid={'password-confirm'}
            >
              Confirmer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    const listener: ModalEventListener<ShowSetPasswordModal> = (ev) => this.setState({ visible: true, title: ev.title, message: ev.message });
    modals.addListener(ModalEventType.ShowSetPassword, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    if (this.state.listener) {
      modals.removeListener(ModalEventType.ShowSetPassword, this.state.listener);
    }
  }

  private handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const password = ev.target.value;
    const formState = this.validateForm(password, this.state.confirmation);
    this.setState({ password, formState });
  };

  private handleConfirmationChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const confirmation = ev.target.value;
    const formState = this.validateForm(this.state.password, confirmation);
    this.setState({ confirmation, formState });
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.SetPasswordClosed,
      value: '',
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false, password: '', confirmation: '' });
  };

  private handleConfirm = () => {
    const { modals } = this.props.services;

    const formState = this.validateForm(this.state.password, this.state.confirmation);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    modals.dispatch({
      type: ModalEventType.SetPasswordClosed,
      value: this.state.password,
      status: ModalStatus.Confirmed,
    });

    this.setState({ visible: false, password: '', confirmation: '' });
  };

  private validateForm(password: string, confirmation: string): FormState {
    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.PasswordTooWeak;
    }

    // Check password confirmation
    if (password !== confirmation) {
      return FormState.PasswordNotConfirmed;
    }

    return FormState.Ok;
  }
}

export default withServices(SetPasswordModal);
