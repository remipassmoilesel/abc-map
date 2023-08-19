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

import Cls from './ProjectManagementView.module.scss';
import React, { useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { useTranslation, withTranslation } from 'react-i18next';
import { ProjectStatus } from './project-status/ProjectStatus';
import { LayersSummary } from './layers-summary/LayersSummary';
import { ProjectionStatus } from './projection-status/ProjectionStatus';
import { LayoutsSummary } from './layouts-summary/LayoutsSummary';
import { SharedViewsSummary } from './shared-views-summary/SharedViewsSummary';
import { Actions } from './actions/Actions';
import { RemoteProjectsManagement } from './remote-projects-management/RemoteProjectsManagement';
import { useIsUserAuthenticated } from '../../../core/authentication/useIsUserAuthenticated';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { useServices } from '../../../core/useServices';

const logger = Logger.get('ProjectManagementView.tsx');

export function ProjectManagementView() {
  const { t } = useTranslation('ProjectManagement');
  const userAuthenticated = useIsUserAuthenticated();
  const { modals, toasts } = useServices();

  const handleLogin = useCallback(() => {
    modals.login().catch((err) => {
      logger.error('Cannot open login modal', err);
      toasts.genericError();
    });
  }, [modals, toasts]);

  return (
    <div className={Cls.panel} data-cy={'project-management-module'}>
      <ProjectStatus className={'mt-5 mb-3'} />
      <Actions className={'mb-3'} />
      <LayersSummary className={'mb-3'} />
      <LayoutsSummary className={'mb-3'} />
      <SharedViewsSummary className={'mb-3'} />
      <ProjectionStatus className={'my-4'} />

      {/* If the user is authenticated, we show him his projects */}
      {userAuthenticated && <RemoteProjectsManagement className={'my-3'} />}
      {!userAuthenticated && (
        <div className={'d-flex align-items-center my-4'}>
          <div className={'mr-4'}>{t('Login_to_save_and_share_your_projects_online')}</div>
          <button onClick={handleLogin} className={'btn btn-outline-primary'}>
            <FaIcon icon={IconDefs.faLockOpen} className={'mr-2'} />
            {t('Login')}
          </button>
        </div>
      )}
    </div>
  );
}

export default withTranslation()(ProjectManagementView);
