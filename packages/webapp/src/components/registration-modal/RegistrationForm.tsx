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

import React, { ChangeEvent, Component, KeyboardEvent, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';
import FormValidationLabel from '../form-validation-label/FormValidationLabel';
import { FormState } from '../form-validation-label/FormState';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { FormOfflineIndicator } from '../offline-indicator/FormOfflineIndicator';
import { OnlineStatusProps, withOnlineStatus } from '../../core/pwa/withOnlineStatus';

const logger = Logger.get('RegistrationForm.tsx');

export interface FormValues {
  email: string;
  password: string;
}

interface Props extends OnlineStatusProps {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

interface State {
  email: string;
  password: string;
  confirmation: string;
  formState: FormState;
}

const t = prefixedTranslation('RegistrationModal:');

class RegistrationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmation: '',
      formState: FormState.InvalidEmail,
    };
  }

  public render(): ReactNode {
    const email = this.state.email;
    const password = this.state.password;
    const confirmation = this.state.confirmation;
    const handleCancel = this.props.onCancel;
    const formState = this.state.formState;
    const offline = !this.props.onlineStatus;

    return (
      <>
        {/* Intro */}

        <p className={'mb-3'}>{t('Please_fill_the_form_to_register')}</p>

        <FormOfflineIndicator />

        {/* Registration form */}

        <input
          type={'email'}
          value={email}
          disabled={offline}
          onChange={this.handleEmailChange}
          onKeyUp={this.handleKeyUp}
          placeholder={t('Email')}
          className={'form-control mb-2'}
          data-cy={'email'}
          data-testid={'email'}
        />
        <input
          type={'password'}
          value={password}
          disabled={offline}
          onChange={this.handlePasswordChange}
          onKeyUp={this.handleKeyUp}
          placeholder={t('Password')}
          className={'form-control mb-2'}
          data-cy={'password'}
          data-testid={'password'}
        />
        <input
          type={'password'}
          value={confirmation}
          disabled={offline}
          onChange={this.handleConfirmationChange}
          onKeyUp={this.handleKeyUp}
          placeholder={t('Password_confirmation')}
          className={'form-control mb-3'}
          data-cy={'password-confirmation'}
          data-testid={'password-confirmation'}
        />

        {/* Form validation */}

        <FormValidationLabel state={formState} className={'mb-4'} />

        {/* Action buttons */}

        <div className={'d-flex justify-content-end'}>
          <button
            type={'button'}
            onClick={handleCancel}
            className={'btn btn-outline-secondary'}
            data-cy={'cancel-registration'}
            data-testid={'cancel-registration'}
          >
            {t('Cancel')}
          </button>

          <button
            type={'button'}
            disabled={formState !== FormState.Ok || offline}
            onClick={this.handleSubmit}
            className={'btn btn-primary ml-2'}
            data-cy={'submit-registration'}
            data-testid={'submit-registration'}
          >
            {t('Register')}
          </button>
        </div>
      </>
    );
  }

  private handleSubmit = () => {
    const email = this.state.email;
    const password = this.state.password;
    const confirmation = this.state.confirmation;

    const formState = this.validateForm(email, password, confirmation);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    this.props.onSubmit({ email, password });
  };

  private handleEmailChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const email = ev.target.value;
    const formState = this.validateForm(email, this.state.password, this.state.confirmation);
    this.setState({ email, formState });
  };

  private handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const password = ev.target.value;
    const formState = this.validateForm(this.state.email, password, this.state.confirmation);
    this.setState({ password, formState });
  };

  private handleConfirmationChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const confirmation = ev.target.value;
    const formState = this.validateForm(this.state.email, this.state.password, confirmation);
    this.setState({ confirmation, formState });
  };

  private handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.handleSubmit();
    }
  };

  private validateForm(email: string, password: string, confirmation: string): FormState {
    // Check email
    if (!ValidationHelper.email(email)) {
      return FormState.InvalidEmail;
    }

    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.PasswordTooWeak;
    }

    // Check password and email different
    if (password === email) {
      return FormState.PasswordEqualEmail;
    }

    // Check password confirmation
    if (password !== confirmation) {
      return FormState.PasswordNotConfirmed;
    }

    return FormState.Ok;
  }
}

export default withOnlineStatus(withTranslation()(RegistrationForm));
