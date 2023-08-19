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

import React, { useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../routes';
import { IconDefs } from '../../icon/IconDefs';
import { useAppSelector } from '../../../core/store/hooks';
import { useServices } from '../../../core/useServices';
import { useIsUserAuthenticated } from '../../../core/authentication/useIsUserAuthenticated';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../action-button/ActionButton';
import { ModalStatus } from '../../../core/ui/typings';

const logger = Logger.get('AuthenticationSection.tsx');

interface Props {
  onToggleMenu: () => void;
}

export function AuthenticationSection(props: Props) {
  const { onToggleMenu } = props;
  const { t } = useTranslation('TopBar');
  const { modals, toasts, authentication } = useServices();
  const user = useAppSelector((st) => st.authentication.user);
  const userAuthenticated = useIsUserAuthenticated();
  const userLabel = user && userAuthenticated ? user.email : t('Hello_visitor');
  const navigate = useNavigate();

  const handleLogin = useCallback(
    () =>
      modals.login().catch((err) => {
        logger.error('Cannot open login modal', err);
        toasts.genericError();
      }),
    [modals, toasts]
  );

  const handlePasswordLost = useCallback(
    () =>
      modals.passwordLost().catch((err) => {
        logger.error('Cannot open login modal', err);
        toasts.genericError();
      }),
    [modals, toasts]
  );

  const handleRegister = useCallback(
    () =>
      modals.registration().catch((err) => {
        logger.error('Cannot open registration modal', err);
        toasts.genericError();
      }),
    [modals, toasts]
  );

  const handleShowUserAccount = useCallback(() => {
    navigate(Routes.userAccount().format());
    onToggleMenu();
  }, [navigate, onToggleMenu]);

  const handleLogout = useCallback(() => {
    modals
      .modificationsLostConfirmation()
      .then((result) => {
        if (ModalStatus.Confirmed === result) {
          return authentication.logout().then(() => {
            toasts.info(`${t('You_are_disconnected')} 👋`);
            navigate(Routes.landing().format());
          });
        }
      })
      .catch((err) => {
        toasts.genericError();
        logger.error('Logout error: ', err);
      });
  }, [authentication, modals, navigate, t, toasts]);

  return (
    <>
      <div className={'d-flex flex-column'}>
        <div className={'ms-2 mb-2'} data-cy={'user-label'}>
          {userLabel}
        </div>

        <div className={'d-flex flex-wrap'}>
          {/* User is not authenticated, we show register / login entries */}
          {!userAuthenticated && (
            <>
              <ActionButton label={t('Login')} icon={IconDefs.faLockOpen} onClick={handleLogin} data-cy={'open-login'} />
              <ActionButton label={t('Register')} icon={IconDefs.faFeather} onClick={handleRegister} />
              <ActionButton label={t('Lost_password')} icon={IconDefs.faKey} onClick={handlePasswordLost} data-cy={'reset-password'} />
            </>
          )}

          {/* User is authenticated, we show my account / logout entries */}
          {userAuthenticated && (
            <>
              <ActionButton label={t('My_account')} icon={IconDefs.faCogs} onClick={handleShowUserAccount} data-cy={'user-profile'} />
              <ActionButton label={t('Logout')} icon={IconDefs.faLock} onClick={handleLogout} data-cy={'logout'} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
