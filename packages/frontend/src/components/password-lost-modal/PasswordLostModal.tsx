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

import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { Modal } from 'react-bootstrap';
import { withServices } from '../../core/withServices';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ValidationHelper } from '../../core/utils/ValidationHelper';
import FormValidationLabel from '../form-validation-label/FormValidationLabel';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { FormState } from '../form-validation-label/FormState';
import { useServices } from '../../core/useServices';
import { useOfflineStatus } from '../../core/pwa/OnlineStatusContext';
import { FormOfflineIndicator } from '../offline-indicator/FormOfflineIndicator';

const logger = Logger.get('PasswordLostModal.tsx');

const t = prefixedTranslation('PasswordLostModal:');

function PasswordLostModal() {
  const { modals, toasts, authentication } = useServices();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(FormState.InvalidEmail);

  const offline = useOfflineStatus();

  useEffect(() => {
    const handleOpen = () => setVisible(true);

    modals.addListener(ModalEventType.ShowPasswordLost, handleOpen);
    return () => modals.removeListener(ModalEventType.ShowPasswordLost, handleOpen);
  }, [modals]);

  const validateForm = useCallback((email: string): FormState => {
    // Check email
    if (!ValidationHelper.email(email)) {
      return FormState.InvalidEmail;
    }

    return FormState.Ok;
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setEmail('');
    modals.dispatch({ type: ModalEventType.LoginClosed, status: ModalStatus.Canceled });
  }, [modals]);

  const handleSubmit = useCallback(() => {
    const formState = validateForm(email);
    if (formState !== FormState.Ok) {
      setFormState(formState);
      return;
    }

    authentication
      .passwordLost(email)
      .then(() => {
        toasts.info(t('Email_sent_check_your_spam'));
        setEmail('');
        setVisible(false);
      })
      .catch((err) => {
        logger.error('Cannot send request for password reset: ', err);
        toasts.genericError(err);
      });
  }, [authentication, email, toasts, validateForm]);

  const handleEmailChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const email = ev.target.value;
      setEmail(email);
      setFormState(validateForm(email));
    },
    [validateForm]
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
    <Modal show={visible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Password_lost')} 🔑</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`d-flex flex-column p-3`}>
          {/*Intro*/}

          <p className={'mb-3'}>{t('Fill_this_form_to_recover_your_password')}</p>

          <FormOfflineIndicator />

          {/* Email form */}

          <div className={`form-group`}>
            <input
              type={'email'}
              value={email}
              onInput={handleEmailChange}
              onKeyUp={handleKeyUp}
              disabled={offline}
              placeholder={t('Email_address')}
              className={'form-control mb-4'}
              data-cy={'email'}
            />
          </div>

          {/* Form validation */}

          <FormValidationLabel state={formState} className={'mb-4'} />

          {/* Action buttons */}

          <div className={'d-flex justify-content-end'}>
            <button type={'button'} onClick={handleClose} className={`btn btn-outline-secondary`} data-cy={'cancel-login'}>
              {t('Cancel')}
            </button>
            <button
              type={'button'}
              disabled={formState !== FormState.Ok || offline}
              onClick={handleSubmit}
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

export default withTranslation()(withServices(PasswordLostModal));
