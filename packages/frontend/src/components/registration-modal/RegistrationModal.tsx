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
import { Logger } from '@abc-map/frontend-commons';
import { ModalEventListener, ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { Modal } from 'react-bootstrap';
import { RegistrationStatus } from '@abc-map/shared-entities';
import { passwordStrength } from 'check-password-strength';
import { ValidationHelper } from '../../core/utils/ValidationHelper';
import Cls from './RegistrationModal.module.scss';

const logger = Logger.get('RegistrationModal.tsx', 'info');

interface State {
  visible: boolean;
  email: string;
  password: string;
  confirmation: string;
  listener?: ModalEventListener;
  formState: FormState;
}

enum FormState {
  InvalidEmail = 'InvalidEmail',
  PasswordTooWeak = 'PasswordTooWeak',
  PasswordNotConfirmed = 'PasswordNotConfirmed',
  PasswordEqualEmail = 'PasswordEqualEmail',
  Ok = 'Ok',
}

class RegistrationModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {
      visible: false,
      email: '',
      password: '',
      confirmation: '',
      formState: FormState.InvalidEmail,
    };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const email = this.state.email;
    const password = this.state.password;
    const confirmation = this.state.confirmation;
    const formState = this.state.formState;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={'fa fa-feather mr-3'} />
            Inscription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex flex-column ${Cls.form}`}>
            {/* Intro */}

            <p className={'mb-2'}>Pour vous inscrire, remplissez ce formulaire et confirmez votre adresse email.</p>
            <p>Vos informations personnelles et vos cartes ne seront jamais transmises à un tiers.</p>

            {/* Registration form */}

            <div className={`form-group`}>
              <input
                type={'email'}
                value={email}
                onChange={this.handleEmailChange}
                onKeyUp={this.handleKeyUp}
                placeholder={'Adresse email'}
                className={'form-control'}
                data-cy={'email'}
              />
              <input
                type={'password'}
                value={password}
                onChange={this.handlePasswordChange}
                onKeyUp={this.handleKeyUp}
                placeholder={'Mot de passe'}
                className={'form-control'}
                data-cy={'password'}
              />
              <input
                type={'password'}
                value={confirmation}
                onChange={this.handleConfirmationChange}
                onKeyUp={this.handleKeyUp}
                placeholder={'Confirmation du mot de passe'}
                className={'form-control'}
                data-cy={'password-confirmation'}
              />
            </div>

            {/* Form validation */}

            <div className={Cls.validation}>
              {FormState.InvalidEmail === formState && (
                <>
                  <i className={'fa fa-exclamation-circle'} /> L&apos;adresse email n&apos;est pas valide.
                </>
              )}
              {FormState.PasswordTooWeak === formState && (
                <>
                  <i className={'fa fa-exclamation-circle'} /> Le mot de passe doit contenir 6 caractères minimum, une majuscule, un chiffre ou un symbole.
                </>
              )}
              {FormState.PasswordNotConfirmed === formState && (
                <>
                  <i className={'fa fa-exclamation-circle'} /> Le mot de passe et la confirmation de mot de passe ne correspond pas.
                </>
              )}
              {FormState.PasswordEqualEmail === formState && (
                <>
                  <i className={'fa fa-exclamation-circle'} /> Le mot de passe et l&apos;email doivent être différents !
                </>
              )}
              {FormState.Ok === formState && (
                <>
                  <i className={'fa fa-rocket'} /> C&apos;est parti !
                </>
              )}
            </div>

            {/* Action buttons */}

            <div className={'d-flex justify-content-end'}>
              <button type={'button'} onClick={this.close} className={'btn btn-outline-secondary'} data-cy={'cancel-registration'}>
                Annuler
              </button>

              <button
                type={'button'}
                disabled={formState !== FormState.Ok}
                onClick={this.handleSubmit}
                className={'btn btn-primary'}
                data-cy={'confirm-registration'}
              >
                Inscription
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
    modals.addListener(ModalEventType.ShowRegistration, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    if (this.state.listener) {
      modals.removeListener(ModalEventType.ShowRegistration, this.state.listener);
    }
  }

  private close = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.RegistrationClosed,
      status: ModalStatus.Canceled,
    });

    this.setState({ visible: false, email: '', password: '', confirmation: '' });
  };

  private handleSubmit = () => {
    const { toasts, authentication, modals } = this.props.services;

    const email = this.state.email;
    const password = this.state.password;
    const confirmation = this.state.confirmation;

    const formState = this.validateForm(email, password, confirmation);
    if (formState !== FormState.Ok) {
      this.setState({ formState });
      return;
    }

    authentication
      .register(email, password)
      .then((res) => {
        if (res.status === RegistrationStatus.EmailAlreadyExists) {
          return toasts.info('Cette adresse email est déjà prise');
        }
        if (res.status === RegistrationStatus.Successful) {
          this.close();
          return toasts.info('Un email vient de vous être envoyé, vous devez activer votre compte');
        }
        toasts.genericError();
      })
      .catch((err) => {
        toasts.genericError();
        logger.error(err);
      })
      .finally(() => {
        modals.dispatch({
          type: ModalEventType.RegistrationClosed,
          status: ModalStatus.Confirmed,
        });
      });
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
    if (!ValidationHelper.isEmailValid(email)) {
      return FormState.InvalidEmail;
    }

    // Check password strength
    const passwordValidation = passwordStrength(password);
    if (passwordValidation.id < 1) {
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

export default withServices(RegistrationModal);
