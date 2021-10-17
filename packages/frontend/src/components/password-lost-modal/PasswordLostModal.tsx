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

import React, { KeyboardEvent, ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { ServiceProps, withServices } from '../../core/withServices';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ValidationHelper } from '../../core/utils/ValidationHelper';
import FormValidationLabel from '../form-validation-label/FormValidationLabel';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('PasswordLostModal.tsx');

interface State {
  visible: boolean;
  email: string;
  formState: FormState;
}

enum FormState {
  InvalidEmail = 'InvalidEmail',
  Ok = 'Ok',
}

const t = prefixedTranslation('PasswordLostModal:');

class PasswordLostModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      email: '',
      formState: FormState.InvalidEmail,
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const email = this.state.email;
    const formState = this.state.formState;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Password_lost')} 🔑</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column p-3`}>
            {/*Intro*/}

            <p className={'mb-3'}>{t('Fill_this_form_to_recover_your_password')}</p>

            {/* Email form */}

            <div className={`form-group`}>
              <input
                type={'email'}
                value={email}
                onInput={this.handleEmailChange}
                onKeyUp={this.handleKeyUp}
                placeholder={t('Email_address')}
                className={'form-control'}
                data-cy={'email'}
              />
            </div>

            {/* Form validation */}

            <FormValidationLabel state={formState} className={'mb-4'} />

            {/* Action buttons */}

            <div className={'d-flex justify-content-end'}>
              <button type={'button'} onClick={this.close} className={`btn btn-outline-secondary`} data-cy={'cancel-login'}>
                {t('Cancel')}
              </button>
              <button
                type={'button'}
                disabled={formState !== FormState.Ok}
                onClick={this.handleSubmit}
                className={`btn btn-primary ml-2`}
                data-cy={'confirm-reset-password'}
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

    modals.addListener(ModalEventType.ShowPasswordLost, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowPasswordLost, this.handleOpen);
  }

  private handleOpen = () => {
    this.setState({ visible: true });
  };

  private close = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.LoginClosed,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false, email: '' });
  };

  private handleSubmit = () => {
    const { toasts, authentication } = this.props.services;

    const email = this.state.email;
    const formState = this.validateForm(email);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    authentication
      .passwordLost(email)
      .then(() => {
        toasts.info(t('Email_sent_check_your_spam'));
        this.close();
      })
      .catch((err) => logger.error(err));
  };

  private handleEmailChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const email = ev.target.value;
    const formState = this.validateForm(email);
    this.setState({ email, formState });
  };

  private handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.handleSubmit();
    }
  };

  private validateForm(email: string): FormState {
    // Check email
    if (!ValidationHelper.email(email)) {
      return FormState.InvalidEmail;
    }

    return FormState.Ok;
  }
}

export default withTranslation()(withServices(PasswordLostModal));
