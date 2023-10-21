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

import React, { useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { Modal } from 'react-bootstrap';
import RegistrationForm, { FormValues } from './RegistrationForm';
import RegistrationDone from './RegistrationDone';
import { useTranslation } from 'react-i18next';
import { AuthenticationError, ErrorType } from '../../core/authentication/AuthenticationError';
import { useServices } from '../../core/useServices';

const logger = Logger.get('RegistrationModal.tsx');

export function RegistrationModal() {
  const { t } = useTranslation('RegistrationModal');
  const { modals, authentication } = useServices();

  const [visible, setVisible] = useState(false);
  const [registrationDone, setRegistrationDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpen = useCallback(() => {
    setVisible(true);
    setRegistrationDone(false);
    setErrorMessage('');
  }, []);

  const handleCancel = useCallback(() => {
    modals.dispatch({
      type: ModalEventType.RegistrationClosed,
      status: ModalStatus.Canceled,
    });

    setVisible(false);
  }, [modals]);

  const handleSubmit = useCallback(
    ({ email, password }: FormValues) => {
      authentication
        .registration(email, password)
        .then(() => setRegistrationDone(true))
        .catch((err) => {
          logger.error('Registration error: ', err);

          if (err instanceof AuthenticationError && err.type === ErrorType.EmailAlreadyInUse) {
            setErrorMessage(t('This_email_address_is_already_in_use'));
          } else {
            setErrorMessage(t('Something_went_wrong'));
          }
        });
    },
    [authentication, t]
  );

  const handleConfirm = useCallback(() => {
    modals.dispatch({
      type: ModalEventType.RegistrationClosed,
      status: ModalStatus.Confirmed,
    });

    setVisible(false);
  }, [modals]);

  useEffect(() => {
    modals.addListener(ModalEventType.ShowRegistration, handleOpen);

    return () => {
      modals.removeListener(ModalEventType.ShowRegistration, handleOpen);
    };
  }, [handleOpen, modals]);

  if (!visible) {
    return <div />;
  }

  return (
    <>
      <Modal show={visible} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Registration')} 🪶</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`d-flex flex-column p-3`}>
          {!registrationDone && <RegistrationForm onSubmit={handleSubmit} onCancel={handleCancel} errorMessage={errorMessage} />}
          {registrationDone && <RegistrationDone onConfirm={handleConfirm} />}
        </Modal.Body>
      </Modal>
    </>
  );
}
