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

import Cls from './ResetPasswordView.module.scss';
import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger, PasswordLostParams } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../core/withServices';
import FormValidationLabel from '../../components/form-validation-label/FormValidationLabel';
import { pageSetup } from '../../core/utils/page-setup';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';
import { FormState } from '../../components/form-validation-label/FormState';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Routes } from '../../routes';
import { withRouter, WithRouterProps } from '../../core/utils/withRouter';
import { prefixI18nTFunc } from '../../i18n/i18n';

const logger = Logger.get('ResetPasswordView.tsx', 'info');

interface State {
  password: string;
  confirmation: string;
  formState: FormState;
}

type Props = WithRouterProps<PasswordLostParams> & ServiceProps & WithTranslation;

class ResetPasswordView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { password: '', confirmation: '', formState: FormState.PasswordTooWeak };
  }

  public render(): ReactNode {
    const t = prefixI18nTFunc('ResetPasswordView:', this.props.t);
    const { password, confirmation, formState } = this.state;

    const submitDisabled = this.state.formState !== FormState.Ok;

    return (
      <div className={Cls.view}>
        <div className={Cls.form}>
          <h3 className={'mb-4'}>{t('Reset_your_password')}</h3>
          <div className={Cls.form}>
            <div className={'my-4'}>{t('Enter_your_new_password_here')}</div>
            <input
              placeholder={t('Password')}
              type={'password'}
              value={password}
              onChange={this.handlePasswordChange}
              className={'form-control mb-2'}
              data-cy={'new-password'}
            />
            <input
              placeholder={t('Confirmation')}
              type={'password'}
              value={confirmation}
              onChange={this.handleConfirmationChange}
              className={'form-control mb-4'}
              data-cy={'confirmation'}
            />

            <FormValidationLabel state={formState} />

            <div className={'d-flex justify-content-end'}>
              <button onClick={this.handleSubmit} className={'mt-4 btn btn-primary'} disabled={submitDisabled} data-cy={'confirm-new-password'}>
                {t('Change_my_password')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup('Réinitialisation de mot de passe');
  }

  public handleSubmit = () => {
    const t = prefixI18nTFunc('ResetPasswordView:', this.props.t);
    const { authentication, toasts, modals } = this.props.services;
    const { params, navigate } = this.props.router;

    const token = params?.token;
    if (!token) {
      toasts.genericError();
      return;
    }

    const password = this.state.password;
    const confirmation = this.state.confirmation;

    const formState = this.validateForm(password, confirmation);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    authentication
      .resetPassword(token, password)
      .then(() => {
        toasts.info(t('Password_reset'));
        this.setState({ password: '', confirmation: '' });
        return modals.login();
      })
      .then(() => navigate(Routes.map().format()))
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Reset password error: ', err);
      });
  };

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

export default withTranslation()(withRouter(withServices(ResetPasswordView)));
