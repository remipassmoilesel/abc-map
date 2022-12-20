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
import FormValidationLabel from '../../components/form-validation-label/FormValidationLabel';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';
import { FormState } from '../../components/form-validation-label/FormState';
import { WithTranslation, withTranslation } from 'react-i18next';

interface Props extends WithTranslation {
  onSubmit: (previousPassword: string, newPassword: string) => void;
}

interface State {
  formState: FormState;
  previousPassword: string;
  newPassword: string;
  confirmation: string;
}

class ChangePasswordForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formState: FormState.PasswordTooWeak,
      previousPassword: '',
      newPassword: '',
      confirmation: '',
    };
  }

  public render(): ReactNode {
    const { t } = this.props;
    const { formState, previousPassword, newPassword, confirmation } = this.state;

    return (
      <div className={'card card-body h-100'}>
        <h2 className={'mb-4'}>{t('Change_my_password')}</h2>
        <input
          type={'password'}
          value={previousPassword}
          onChange={this.handlePreviousPasswordChange}
          placeholder={t('Current_password')}
          className={'form-control mb-2'}
          data-cy={'change-password-old-password'}
        />
        <input
          type={'password'}
          value={newPassword}
          onChange={this.handleNewPasswordChange}
          placeholder={t('New_password')}
          className={'form-control mb-2'}
          data-cy={'change-password-new-password'}
        />
        <input
          type={'password'}
          value={confirmation}
          onChange={this.handleConfirmationChange}
          placeholder={t('Confirmation')}
          className={'form-control mb-2'}
          data-cy={'change-password-confirmation'}
        />
        <FormValidationLabel state={formState} />

        <div className={'flex-grow-1'} />

        <div className={'d-flex justify-content-end mt-3'}>
          <button onClick={this.handleSubmit} className={'btn btn-primary'} disabled={formState !== FormState.Ok} data-cy={'change-password-button'}>
            {t('Confirm')}
          </button>
        </div>
      </div>
    );
  }

  private handlePreviousPasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const previousPassword = ev.target.value;
    this.setState({ previousPassword });
  };

  private handleNewPasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const newPassword = ev.target.value;
    const formState = this.validateForm(newPassword, this.state.confirmation);
    this.setState({ newPassword, formState });
  };

  private handleConfirmationChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const confirmation = ev.target.value;
    const formState = this.validateForm(this.state.newPassword, confirmation);
    this.setState({ confirmation, formState });
  };

  private handleSubmit = () => {
    const previousPassword = this.state.previousPassword;
    const newPassword = this.state.newPassword;
    const confirmation = this.state.confirmation;

    const formState = this.validateForm(newPassword, confirmation);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    this.props.onSubmit(previousPassword.trim(), newPassword.trim());
  };

  private validateForm(password: string, confirmation: string): FormState {
    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.PasswordTooWeak;
    }

    // Check confirmation
    if (password.trim() !== confirmation.trim()) {
      return FormState.PasswordNotConfirmed;
    }

    return FormState.Ok;
  }
}

export default withTranslation('UserAccountView')(ChangePasswordForm);
