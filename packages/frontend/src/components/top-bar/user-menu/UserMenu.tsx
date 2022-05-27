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

import Cls from './UserMenu.module.scss';
import React, { useCallback, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Logger, UserStatus } from '@abc-map/shared';
import { useHistory } from 'react-router-dom';
import { prefixedTranslation } from '../../../i18n/i18n';
import { Routes } from '../../../routes';
import { FaIcon } from '../../icon/FaIcon';
import { IconDefs } from '../../icon/IconDefs';
import { ExperimentalFeatures } from '../../../experimental-features';
import ExperimentalFeaturesModal from '../experimental-features/ExperimentalFeaturesModal';
import { useAppSelector } from '../../../core/store/hooks';
import { useServices } from '../../../core/useServices';
import { useRunningAsPwa } from '../../../core/pwa/useRunningAsPwa';

const logger = Logger.get('UserMenu.tsx');

const t = prefixedTranslation('UserMenu:');

export function UserMenu() {
  const { modals, toasts, authentication, project } = useServices();
  const [experimentalFeaturesModal, setExperimentalFeaturesModal] = useState(false);
  const user = useAppSelector((st) => st.authentication.user);
  const userStatus = useAppSelector((st) => st.authentication.userStatus);
  const userAuthenticated = userStatus === UserStatus.Authenticated;
  const userLabel = user && userAuthenticated ? user.email : t('Hello_visitor');
  const experimentalFeaturesMenuEntry = ExperimentalFeatures.length > 0;
  const history = useHistory();
  const runningAsPwa = useRunningAsPwa();

  const handleInstallApp = useCallback(() => {
    modals.pwaInstall().catch((err) => logger.error('Cannot show app modal: ', err));
  }, [modals]);

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

  const handleUserAccount = useCallback(() => history.push(Routes.userAccount().format()), [history]);

  const handleLogout = useCallback(() => {
    project
      .newProject()
      .then(() => authentication.logout())
      .then(() => {
        toasts.info(`${t('You_are_disconnected')} 👋`);
        history.push(Routes.landing().format());
      })
      .catch((err) => {
        toasts.genericError();
        logger.error('Logout error: ', err);
      });
  }, [authentication, history, project, toasts]);

  const handleFeedback = useCallback(() => modals.textFeedback().catch((err) => logger.error('Feedback modal error: ', err)), [modals]);

  const handleExperimentalFeaturesModal = useCallback(() => setExperimentalFeaturesModal(true), []);
  const handleExperimentalFeaturesModalClosed = useCallback(() => setExperimentalFeaturesModal(false), []);

  return (
    <>
      <Dropdown className={Cls.userMenu} align={'end'}>
        {/* Open button */}
        <Dropdown.Toggle variant="light" data-cy={'user-menu'}>
          <FaIcon icon={IconDefs.faUserCircle} size={'1.7rem'} />
        </Dropdown.Toggle>

        <Dropdown.Menu className={Cls.dropDown}>
          <Dropdown.ItemText data-cy={'user-label'}>{userLabel}</Dropdown.ItemText>
          <Dropdown.Divider />

          {/* User is not authenticated, we show register / login entries */}
          {!userAuthenticated && (
            <>
              <Dropdown.Item onClick={handleLogin}>
                <FaIcon icon={IconDefs.faLockOpen} className={'mr-3'} />
                {t('Login')}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleRegister}>
                <FaIcon icon={IconDefs.faFeather} className={'mr-3'} />
                {t('Register')}
              </Dropdown.Item>
              <Dropdown.Item onClick={handlePasswordLost} data-cy={'reset-password'}>
                <FaIcon icon={IconDefs.faKey} className={'mr-3'} />
                {t('Lost_password')}
              </Dropdown.Item>
            </>
          )}

          {/* User is authenticated, we show my account / logout entries */}
          {userAuthenticated && (
            <>
              <Dropdown.Item onClick={handleUserAccount} data-cy={'user-profile'}>
                <FaIcon icon={IconDefs.faCogs} className={'mr-3'} /> {t('My_account')}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} data-cy={'logout'}>
                <FaIcon icon={IconDefs.faLock} className={'mr-3'} /> {t('Logout')}
              </Dropdown.Item>
            </>
          )}

          <Dropdown.Divider />

          {/* Install app */}
          {!runningAsPwa && (
            <Dropdown.Item onClick={handleInstallApp}>
              <FaIcon icon={IconDefs.faDownload} className={'mr-3'} />
              {t('Install_app')}
            </Dropdown.Item>
          )}

          {/* Feedback */}
          <Dropdown.Item onClick={handleFeedback}>
            <FaIcon icon={IconDefs.faComments} className={'mr-3'} />
            {t('Feedbacks')}
          </Dropdown.Item>

          <Dropdown.Divider />

          {experimentalFeaturesMenuEntry && (
            <Dropdown.Item onClick={handleExperimentalFeaturesModal} data-cy={'experimental-features'}>
              <FaIcon icon={IconDefs.faFlask} className={'mr-3'} />
              {t('Experimental_features')}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {experimentalFeaturesModal && <ExperimentalFeaturesModal visible={experimentalFeaturesModal} onClose={handleExperimentalFeaturesModalClosed} />}
    </>
  );
}
