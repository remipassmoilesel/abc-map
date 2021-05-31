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
import { ModalEventListener, ModalEventType, ModalStatus, ShowPasswordInputModal } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import FormValidationLabel, { FormState } from '../form-state-label/FormValidationLabel';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';

interface State {
  visible: boolean;
  title: string;
  message: string;
  value: string;
  formState: FormState;
  listener?: ModalEventListener<ShowPasswordInputModal>;
}

class PasswordInputModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      message: '',
      value: '',
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
              value={value}
              placeholder={'Mot de passe'}
              onChange={this.handleInputChange}
              data-cy="password-input"
              data-testid="password-input"
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

    const listener: ModalEventListener<ShowPasswordInputModal> = (ev) => this.setState({ visible: true, title: ev.title, message: ev.message });
    modals.addListener(ModalEventType.ShowPasswordInput, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    if (this.state.listener) {
      modals.removeListener(ModalEventType.ShowPasswordInput, this.state.listener);
    }
  }

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
    const { modals } = this.props.services;

    const formState = this.validateForm(this.state.value);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    modals.dispatch({
      type: ModalEventType.PasswordInputClosed,
      value: this.state.value,
      status: ModalStatus.Confirmed,
    });

    this.setState({ visible: false, value: '' });
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
