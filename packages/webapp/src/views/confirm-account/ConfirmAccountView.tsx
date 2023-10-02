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

import React, { useEffect, useRef, useState } from 'react';
import { ConfirmAccountTokenParam, ConfirmationStatus, Logger } from '@abc-map/shared';
import { Link, useSearchParams } from 'react-router-dom';
import { HttpError } from '../../core/http/HttpError';
import { addNoIndexMeta, pageSetup, removeNoIndexMeta } from '../../core/utils/page-setup';
import { useTranslation, withTranslation } from 'react-i18next';
import { Routes } from '../../routes';
import { useServices } from '../../core/useServices';
import Cls from './ConfirmAccountView.module.scss';

const logger = Logger.get('ConfirmAccountView.tsx');

function ConfirmAccountView() {
  const { t } = useTranslation('ConfirmAccountView');
  const { authentication, toasts } = useServices();
  const [status, setStatus] = useState(ConfirmationStatus.InProgress);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    pageSetup(t('Registration_confirmation'));
    addNoIndexMeta();

    return () => removeNoIndexMeta();
  }, [t]);

  const confirmationInProgress = useRef(false);
  useEffect(() => {
    const token = searchParams.get(ConfirmAccountTokenParam);
    if (!token) {
      setStatus(ConfirmationStatus.Failed);
      return;
    }
    if (confirmationInProgress.current) {
      logger.error('Confirmation already in progress');
      return;
    }

    confirmationInProgress.current = true;
    authentication
      .confirmRegistration(token)
      .then((res) => setStatus(res.status))
      .catch((err) => {
        logger.error('Registration error: ', err);
        if (HttpError.isConflict(err)) {
          setStatus(ConfirmationStatus.AlreadyConfirmed);
        } else if (HttpError.isUnauthorized(err)) {
          setStatus(ConfirmationStatus.Failed);
        } else {
          toasts.genericError(err);
          setStatus(ConfirmationStatus.Failed);
        }
      })
      .finally(() => (confirmationInProgress.current = false));
  }, [authentication, toasts, searchParams]);

  return (
    <div className={Cls.confirmAccount}>
      {/* Loading */}
      {ConfirmationStatus.InProgress === status && <div>{t('Please_wait')}</div>}

      {/* Account already confirmed */}
      {ConfirmationStatus.AlreadyConfirmed === status && (
        <>
          <h3 className={'mb-4'} dangerouslySetInnerHTML={{ __html: t('Oups') }} />
          <div dangerouslySetInnerHTML={{ __html: t('This_account_is_already_activated') }} />
        </>
      )}

      {/* Account confirmation failed */}
      {ConfirmationStatus.Failed === status && (
        <>
          <h3 className={'mb-4'} dangerouslySetInnerHTML={{ __html: t('Oups') }} />
          <div dangerouslySetInnerHTML={{ __html: t('Activation_failed') }} />
        </>
      )}

      {/* Account confirmation succeed */}
      {ConfirmationStatus.Succeed === status && (
        <>
          <h3 className={'mb-4'} dangerouslySetInnerHTML={{ __html: t('And_voila_welcome') }} />
          <div data-cy={'account-enabled'}>
            <div className={'mb-3'}>{t('You_should_close_the_other_tabs')}</div>
            <div>{t('Activation_succeed')} ✨</div>
            <Link to={Routes.map().format()}>{t('Map_is_over_here')}</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default withTranslation()(ConfirmAccountView);
