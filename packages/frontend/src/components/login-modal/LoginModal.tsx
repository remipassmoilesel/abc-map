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

import React, { ChangeEvent, Component, KeyboardEvent, ReactNode } from 'react';
import { FrontendRoutes, Logger } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { ServiceProps, withServices } from '../../core/withServices';
import { ModalEventListener, ModalEventType, ModalStatus } from '../../core/ui/typings';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';
import Cls from './LoginModal.module.scss';
import FormValidationLabel, { FormState } from '../form-state-label/FormValidationLabel';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const logger = Logger.get('LoginModal.tsx', 'info');

declare type Props = ServiceProps & RouteComponentProps<any>;

interface State {
  visible: boolean;
  email: string;
  password: string;
  listener?: ModalEventListener;
  formState: FormState;
}

class LoginModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      email: '',
      password: '',
      formState: FormState.InvalidEmail,
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const email = this.state.email;
    const password = this.state.password;
    const formState = this.state.formState;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={'fa fa-lock-open mr-3'} />
            Connexion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column ${Cls.form}`}>
            {/*Intro*/}

            <p>Pour vous connecter, renseignez votre adresse email et votre mot de passe ci-dessous:</p>

            {/* Login form */}

            <div className={`form-group`}>
              <input
                type={'email'}
                value={email}
                onInput={this.handleEmailChange}
                onKeyUp={this.handleKeyUp}
                placeholder={'Adresse email'}
                className={'form-control'}
                data-cy={'email'}
                data-testid={'email'}
              />
              <input
                type={'password'}
                value={password}
                onInput={this.handlePasswordChange}
                onKeyUp={this.handleKeyUp}
                placeholder={'Mot de passe'}
                className={'form-control'}
                data-cy={'password'}
                data-testid={'password'}
              />
            </div>

            <div className={'d-flex justify-content-end'}>
              <button onClick={this.handlePasswordLost} className={'btn btn-link'}>
                Mot de passe perdu ?
              </button>
            </div>

            {/* Form validation */}
            <FormValidationLabel state={formState} />

            {/* Action buttons */}

            <div className={'d-flex justify-content-end'}>
              <button
                type={'button'}
                onClick={this.handleCancel}
                className={`btn btn-outline-secondary ${Cls.actionButton}`}
                data-cy={'cancel-login'}
                data-testid={'cancel-login'}
              >
                Annuler
              </button>
              <button
                type={'button'}
                disabled={formState !== FormState.Ok}
                onClick={this.handleSubmit}
                className={`btn btn-primary ${Cls.actionButton}`}
                data-cy={'confirm-login'}
                data-testid={'confirm-login'}
              >
                Connexion
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    const listener: ModalEventListener = () => this.setState({ visible: true });
    modals.addListener(ModalEventType.ShowLogin, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    if (this.state.listener) {
      modals.removeListener(ModalEventType.ShowLogin, this.state.listener);
    }
  }

  private handlePasswordLost = () => {
    const { modals, toasts } = this.props.services;

    modals.dispatch({
      type: ModalEventType.LoginClosed,
      status: ModalStatus.Canceled,
    });
    this.setState({ visible: false, email: '', password: '' });

    setTimeout(() => {
      modals.passwordLost().catch((err) => {
        toasts.genericError();
        logger.error('Cannot open password lost modal', err);
      });
    }, 400);
  };

  private handleCancel = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.LoginClosed,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false, email: '', password: '' });
  };

  private handleSubmit = () => {
    const { authentication, modals } = this.props.services;
    const email = this.state.email;
    const password = this.state.password;

    const formState = this.validateForm(email, password);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    authentication
      .login(email, password)
      .then(() => {
        modals.dispatch({
          type: ModalEventType.LoginClosed,
          status: ModalStatus.Confirmed,
        });
        this.setState({ visible: false, email: '', password: '' });

        this.props.history.push(FrontendRoutes.map().raw());
      })
      .catch((err) => logger.error(err));
  };

  private handleEmailChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const email = ev.target.value;
    const formState = this.validateForm(email, this.state.password);
    this.setState({ email, formState });
  };

  private handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const password = ev.target.value;
    const formState = this.validateForm(this.state.email, password);
    this.setState({ password, formState });
  };

  private handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.handleSubmit();
    }
  };

  private validateForm(email: string, password: string): FormState {
    // Check email
    if (!ValidationHelper.email(email)) {
      return FormState.InvalidEmail;
    }

    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.InvalidPassword;
    }

    return FormState.Ok;
  }
}

export default withRouter(withServices(LoginModal));
