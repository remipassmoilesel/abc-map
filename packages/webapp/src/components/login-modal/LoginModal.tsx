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

import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { Logger, UserStatus } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { PasswordStrength, ValidationHelper } from '../../core/utils/ValidationHelper';
import FormValidationLabel from '../form-validation-label/FormValidationLabel';
import { FormState } from '../form-validation-label/FormState';
import { useTranslation, withTranslation } from 'react-i18next';
import { AuthenticationError, ErrorType } from '../../core/authentication/AuthenticationError';
import { FormOfflineIndicator } from '../offline-indicator/FormOfflineIndicator';
import { useOfflineStatus } from '../../core/pwa/OnlineStatusContext';
import { useServices } from '../../core/useServices';

const logger = Logger.get('LoginModal.tsx');

function LoginModal() {
  const { t } = useTranslation('LoginModal');
  const { modals, toasts, authentication } = useServices();

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState(FormState.InvalidEmail);
  const [errorMessage, setErrorMessage] = useState('');

  const offline = useOfflineStatus();

  useEffect(() => {
    const handleOpen = () => setVisible(true);

    modals.addListener(ModalEventType.ShowLogin, handleOpen);
    return () => modals.removeListener(ModalEventType.ShowLogin, handleOpen);
  }, [modals]);

  const validateForm = useCallback((email: string, password: string): FormState => {
    // Check email
    if (!ValidationHelper.email(email)) {
      return FormState.InvalidEmail;
    }

    // Check password strength
    if (ValidationHelper.password(password) !== PasswordStrength.Correct) {
      return FormState.InvalidPassword;
    }

    return FormState.Ok;
  }, []);

  const handlePasswordLost = useCallback(() => {
    modals.dispatch({ type: ModalEventType.LoginClosed, status: ModalStatus.Canceled });
    setVisible(false);
    setEmail('');
    setPassword('');
    setErrorMessage('');

    setTimeout(() => {
      modals.passwordLost().catch((err) => {
        toasts.genericError();
        logger.error('Cannot open password lost modal', err);
      });
    }, 400);
  }, [modals, toasts]);

  const handleCancel = useCallback(() => {
    modals.dispatch({
      type: ModalEventType.LoginClosed,
      status: ModalStatus.Canceled,
    });

    setVisible(false);
    setEmail('');
    setPassword('');
  }, [modals]);

  const handleSubmit = useCallback(() => {
    const formState = validateForm(email, password);
    if (formState !== FormState.Ok) {
      setFormState(formState);
      return;
    }

    authentication
      .login(email, password)
      .then((status) => {
        if (UserStatus.Authenticated === status) {
          toasts.info(t('You_are_connected'));
        }

        setVisible(false);
        setEmail('');
        setPassword('');

        modals.dispatch({ type: ModalEventType.LoginClosed, status: ModalStatus.Confirmed });
      })
      .catch((err) => {
        logger.error('Login error: ', err);

        if (err instanceof AuthenticationError && err.type === ErrorType.InvalidCredentials) {
          setErrorMessage(t('Invalid_credentials'));
        } else {
          setErrorMessage(t('Something_went_wrong'));
        }
      });
  }, [authentication, email, modals, password, t, toasts, validateForm]);

  const handleEmailChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const email = ev.target.value;
      setEmail(email);
      setFormState(validateForm(email, password));
    },
    [password, validateForm]
  );

  const handlePasswordChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const password = ev.target.value;
      setPassword(password);
      setFormState(validateForm(email, password));
    },
    [email, validateForm]
  );

  const handleKeyUp = useCallback(
    (ev: KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  if (!visible) {
    return <div />;
  }

  return (
    <Modal show={visible} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Login')} 🔓</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`d-flex flex-column p-3`}>
          {/* Intro */}
          <p>{t('To_connect_type_email_password')}</p>

          {/* Login form */}

          <FormOfflineIndicator />

          <div className={'d-flex flex-column mb-3'}>
            <input
              type={'email'}
              value={email}
              onInput={handleEmailChange}
              disabled={offline}
              onKeyUp={handleKeyUp}
              placeholder={t('Email')}
              className={'form-control my-2'}
              data-cy={'email'}
              data-testid={'email'}
            />
            <input
              type={'password'}
              value={password}
              onInput={handlePasswordChange}
              disabled={offline}
              onKeyUp={handleKeyUp}
              placeholder={t('Password')}
              className={'form-control my-2'}
              data-cy={'password'}
              data-testid={'password'}
            />
          </div>

          {/* Form validation */}

          <FormValidationLabel state={formState} className={'mb-3'} />

          {errorMessage && (
            <div className={'alert alert-warning mb-3'} data-cy={'login-error-message'}>
              {errorMessage}
            </div>
          )}

          {/* Action buttons */}

          <div className={'d-flex justify-content-end'}>
            <button onClick={handlePasswordLost} className={'btn btn-link mr-3'}>
              {t('Password_lost')}
            </button>
            <button type={'button'} onClick={handleCancel} className={`btn btn-outline-secondary`} data-cy={'cancel-login'} data-testid={'cancel-login'}>
              {t('Cancel')}
            </button>
            <button
              type={'button'}
              disabled={formState !== FormState.Ok || offline}
              onClick={handleSubmit}
              className={`btn btn-primary ml-2`}
              data-cy={'confirm-login'}
              data-testid={'confirm-login'}
            >
              {t('Connect')}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(LoginModal);
