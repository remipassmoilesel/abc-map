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
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';

interface Props {
  onSubmit: (password: string) => void;
}

interface State {
  formState: FormState;
  confirmation: boolean;
  password: string;
}

const t = prefixedTranslation('UserAccountView:');

class DeleteAccountForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formState: FormState.DeletionNotConfirmed,
      confirmation: false,
      password: '',
    };
  }

  public render(): ReactNode {
    const formState = this.state.formState;
    const confirmation = this.state.confirmation;
    const password = this.state.password;

    return (
      <div className={'card card-body h-100'}>
        <h2 className={'mb-4'}>{t('Delete_my_account')}</h2>
        <div className={'alert alert-danger'}>
          <input type={'checkbox'} checked={confirmation} onChange={this.handleConfirmationChange} className={'mr-2'} data-cy={'delete-account-checkbox'} />
          {t('I_understand_that_deletion_is_permanent')}
        </div>
        <div className={'mb-2'}>{t('Password')}:</div>

        <input type={'password'} value={password} onChange={this.handlePasswordChange} className={'form-control'} data-cy={'delete-account-password'} />

        <FormValidationLabel state={formState} />

        <div className={'flex-grow-1'} />

        <div className={'d-flex justify-content-end mt-3'}>
          <button onClick={this.handleSubmit} className={'btn btn-danger'} disabled={formState !== FormState.Ok} data-cy={'delete-account-button'}>
            {t('Delete_my_account_permanently')}
          </button>
        </div>
      </div>
    );
  }

  private handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const password = ev.target.value;
    const formState = this.validateForm(password, this.state.confirmation);
    this.setState({ password, formState });
  };

  private handleConfirmationChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const confirmation = ev.target.checked;
    const formState = this.validateForm(this.state.password, confirmation);
    this.setState({ confirmation, formState });
  };

  private handleSubmit = () => {
    const password = this.state.password;
    const confirmation = this.state.confirmation;

    const formState = this.validateForm(password, confirmation);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    this.props.onSubmit(password.trim());
  };

  private validateForm(password: string, confirmation: boolean): FormState {
    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.InvalidPassword;
    }

    // Check confirmation
    if (!confirmation) {
      return FormState.DeletionNotConfirmed;
    }

    return FormState.Ok;
  }
}

export default withTranslation()(DeleteAccountForm);
