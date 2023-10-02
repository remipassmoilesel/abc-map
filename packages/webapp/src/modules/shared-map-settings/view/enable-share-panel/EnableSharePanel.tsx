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

import Cls from './EnableSharePanel.module.scss';
import React, { useCallback } from 'react';
import { LayerState, Logger, UserStatus } from '@abc-map/shared';
import { useAppSelector } from '../../../../core/store/hooks';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useServices } from '../../../../core/useServices';
import { useSaveProjectOnline } from '../../../../core/project/useSaveProjectOnline';
import { ProjectStatus } from '../../../../core/project/ProjectStatus';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

const logger = Logger.get('EnableSharePanel.tsx');

export function EnableSharePanel() {
  const { project, modals, geo, toasts } = useServices();
  const { t } = useTranslation('SharedMapSettingsModule');
  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const saveProject = useSaveProjectOnline();

  // User status, project status
  const userAuthenticated = useAppSelector((st) => st.authentication.userStatus) === UserStatus.Authenticated;

  const publishProject = useCallback(() => {
    const publish = async () => {
      const quotas = await project.getQuotas();
      if (quotas.remaining < 1) {
        toasts.tooMuchProjectError();
        return;
      }

      // Set public
      project.setPublic(true);

      // Create shared view if none. This action is not undoable, at least one view is necessary for public maps.
      if (!sharedViews.length) {
        const mainMap = geo.getMainMap();
        const viewId = nanoid();
        const layers: LayerState[] = mainMap
          .getLayers()
          .map((layer) => ({ layerId: layer.getId(), visible: true }))
          .filter((st): st is LayerState => !!st.layerId);
        project.addSharedViews([
          {
            id: viewId,
            title: t('Main_view'),
            view: mainMap.getView(),
            layers,
            textFrames: [],
          },
        ]);
        project.setActiveSharedView(viewId);
      }

      // Save project
      return saveProject();
    };

    publish()
      .then((status) => {
        if (ProjectStatus.Ok !== status) {
          project.setPublic(false);
        }
      })
      .catch((err) => {
        project.setPublic(false);
        logger.error('Cannot publish project: ', err);
      });
  }, [geo, project, saveProject, sharedViews.length, t, toasts]);

  // Login, register
  const handleLogin = useCallback(() => modals.login().catch((err) => logger.error('Login modal error: ', err)), [modals]);
  const handleRegister = useCallback(() => modals.registration().catch((err) => logger.error('Registration modal error: ', err)), [modals]);

  return (
    <>
      <div className={'d-flex flex-column justify-content-center align-items-center p-3'}>
        {/* Icon, title, introduction */}
        <FaIcon icon={IconDefs.faShareAltSquare} size={'5rem'} className={'mb-4'} />
        <h3 className={'mb-4 text-center'}>{t('Map_sharing')}</h3>
        <div className={'mb-5 text-center'} dangerouslySetInnerHTML={{ __html: t('You_can_share_your_map_using_a_public_link') }} />

        {/* User is not authenticated, we inform him */}
        {!userAuthenticated && (
          <>
            <h5 className={'mb-4'}>{t('You_must_sign_in_to_share_your_maps')}</h5>

            <div className={'d-flex'}>
              <button onClick={handleLogin} className={`btn btn-outline-primary ${Cls.authButton}`}>
                <FaIcon icon={IconDefs.faLockOpen} className={'mr-3'} />
                {t('Login')}
              </button>

              <button onClick={handleRegister} className={`btn btn-outline-primary ${Cls.authButton}`}>
                <FaIcon icon={IconDefs.faFeatherAlt} className={'mr-3'} />
                {t('Register')}
              </button>
            </div>
          </>
        )}

        {/* User is connected, we advise him about credentials and sharing */}
        {userAuthenticated && (
          <>
            <div className={Cls.enableForm}>
              <div className={'alert alert-warning'}>
                <div className={'mb-2'}>
                  <h5>⚠️ {t('Warning')}</h5>
                </div>
                <div>{t('If_your_map_contains_identifiers')}</div>
                <div>{t('If_these_identifiers_give_access_to_paid_services')}</div>
              </div>

              {/* Enable / disable map sharing */}
              <div className={Cls.statusText}>
                <FaIcon icon={IconDefs.faBan} className={`${Cls.icon} ${Cls.disabled}`} size={'1.7rem'} />
                <div className={`mr-3 ${Cls.statusText}`}>{t('This_map_is_private')}</div>

                <div className={'flex-grow-1'} />

                <button className={'btn btn-outline-primary'} onClick={publishProject} data-cy={'enable-sharing'}>
                  {t('Enable_sharing')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
