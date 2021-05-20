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
import { FrontendRoutes, Logger, PasswordLostParams } from '@abc-map/shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ServiceProps, withServices } from '../../core/withServices';
import { PasswordStrength, Strength } from '../../core/utils/PasswordStrength';
import FormValidationLabel, { FormState } from '../../components/form-state-label/FormValidationLabel';
import Cls from './ResetPasswordView.module.scss';

const logger = Logger.get('ResetPasswordView.tsx', 'info');

interface State {
  password: string;
  confirmation: string;
  formState: FormState;
}

type Props = RouteComponentProps<PasswordLostParams> & ServiceProps;

class ResetPasswordView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: '',
      confirmation: '',
      formState: FormState.PasswordTooWeak,
    };
  }

  public render(): ReactNode {
    const password = this.state.password;
    const confirmation = this.state.confirmation;
    const formState = this.state.formState;

    return (
      <div className={Cls.resetPassword}>
        <h3 className={'mb-4'}>Réinitialiser votre mot de passe</h3>
        <div className={Cls.form}>
          <div className={'my-4'}>Entrez ici votre nouveau mot de passe et confirmez-le.</div>
          <div className={'form-group'}>
            <input
              placeholder={'Mot de passe'}
              type={'password'}
              value={password}
              onChange={this.handlePasswordChange}
              className={'form-control'}
              data-cy={'new-password'}
            />
          </div>
          <div className={'form-group'}>
            <input
              placeholder={'Confirmation'}
              type={'password'}
              value={confirmation}
              onChange={this.handleConfirmationChange}
              className={'form-control'}
              data-cy={'confirmation'}
            />
          </div>

          <FormValidationLabel state={formState} />

          <div className={'d-flex justify-content-end'}>
            <button className={'mt-4 btn btn-primary'} onClick={this.handleSubmit} data-cy={'reset-password'}>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    );
  }

  public handleSubmit = () => {
    const { authentication, toasts, modals } = this.props.services;

    const token = this.props.match.params.token;
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
        toasts.info('Mot de passe réinitialisé !');
        this.setState({ password: '', confirmation: '' });
        return modals.login();
      })
      .then(() => this.props.history.push(FrontendRoutes.map().raw()))
      .catch((err) => logger.error('Reset password error: ', err));
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
    if (PasswordStrength.check(password) !== Strength.Correct) {
      return FormState.PasswordTooWeak;
    }

    // Check confirmation
    if (password.trim() !== confirmation.trim()) {
      return FormState.PasswordNotConfirmed;
    }

    return FormState.Ok;
  }
}

export default withRouter(withServices(ResetPasswordView));
