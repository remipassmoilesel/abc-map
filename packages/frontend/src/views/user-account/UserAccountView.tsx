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

import React, { useCallback, useEffect, useState } from 'react';
import { Logger, UserStatus } from '@abc-map/shared';
import ChangePasswordForm from './ChangePasswordForm';
import DeleteAccountForm from './DeleteAccountForm';
import { Link, useHistory } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { useTranslation, withTranslation } from 'react-i18next';
import Cls from './UserAccountView.module.scss';
import { Routes } from '../../routes';
import { AccountInformations } from './AccountInformations';
import { AuthenticationError, ErrorType } from '../../core/authentication/AuthenticationError';
import { useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/useServices';
import { useOfflineStatus } from '../../core/pwa/OnlineStatusContext';
import { LargeOfflineIndicator } from '../../components/offline-indicator/LargeOfflineIndicator';

const logger = Logger.get('UserAccountView.tsx');

function UserAccountView() {
  const { t } = useTranslation('UserAccountView');
  const { authentication, toasts } = useServices();
  const [passwordFormVersion, setPasswordFormVersion] = useState(0);

  const user = useAppSelector((st) => st.authentication.user);
  const authenticated = useAppSelector((st) => st.authentication.userStatus) === UserStatus.Authenticated;
  const history = useHistory();

  const offline = useOfflineStatus();

  useEffect(() => pageSetup('Mon compte'), []);

  const handleChangePassword = useCallback(
    (previousPassword: string, newPassword: string) => {
      authentication
        .updatePassword(previousPassword, newPassword)
        .then(() => {
          toasts.info(t('Password_updated'));
          setPasswordFormVersion(passwordFormVersion + 1);
        })
        .catch((err) => {
          logger.error('Cannot update password', err);

          if (err instanceof AuthenticationError && err.type === ErrorType.InvalidCredentials) {
            toasts.error(t('Your_password_is_incorrect'));
          } else {
            toasts.genericError(err);
          }
        });
    },
    [authentication, passwordFormVersion, t, toasts]
  );

  const handleDeleteAccount = useCallback(
    (password: string) => {
      authentication
        .deleteAccount(password)
        .then(() => {
          toasts.info(t('Your_account_has_been_deleted'));
          history.push(Routes.landing().format());
          return authentication.logout();
        })
        .catch((err) => {
          logger.error('Cannot delete account: ', err);

          if (err instanceof AuthenticationError && err.type === ErrorType.InvalidCredentials) {
            toasts.error(t('Your_password_is_incorrect'));
          } else {
            toasts.genericError(err);
          }
        });
    },
    [authentication, history, t, toasts]
  );

  if (offline) {
    return (
      <LargeOfflineIndicator>
        <span dangerouslySetInnerHTML={{ __html: t('Connect_to_the_Internet_to_manage_your_account') }} />
      </LargeOfflineIndicator>
    );
  }

  return (
    <div className={Cls.userAccount}>
      <h1 className={'my-5'}>{t('My_account')}</h1>
      {!authenticated && (
        <div className={'my-5 d-flex flex-column align-items-center'}>
          <div className={'mb-4'}>{t('You_must_connect_to_display_your_account')}</div>
          <Link to={Routes.landing().format()} className={'btn btn-outline-primary'}>
            {t('Go_back_to_landing')}
          </Link>
        </div>
      )}

      {authenticated && user && (
        <div className={'container'}>
          <div className={'row'}>
            <div className={'col-xl-4 mb-3'}>
              <AccountInformations user={user} />
            </div>

            <div className={'col-xl-4 mb-3'}>
              <ChangePasswordForm key={passwordFormVersion} onSubmit={handleChangePassword} />
            </div>

            <div className={'col-xl-4 mb-3'}>
              <DeleteAccountForm onSubmit={handleDeleteAccount} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withTranslation('UserAccountView')(UserAccountView);
