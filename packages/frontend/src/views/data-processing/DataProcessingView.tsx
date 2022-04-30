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
import Cls from './DataProcessingView.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { DataProcessingParams, Logger } from '@abc-map/shared';
import { Link, useLocation, useParams } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { getLang, prefixedTranslation } from '../../i18n/i18n';
import { Routes } from '../../routes';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../../components/icon/FaIcon';
import { IconDefs } from '../../components/icon/IconDefs';
import SideMenu from '../../components/side-menu/SideMenu';
import { isDesktopDevice } from '../../core/ui/isDesktopDevice';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { FloatingButton } from '../../components/floating-button/FloatingButton';
import { UiActions } from '../../core/store/ui/actions';
import { ModuleRegistry } from '../../data-processing/ModuleRegistry';
import ModuleErrorBoundary from './ModuleErrorBoundary';
import { useServices } from '../../core/useServices';

const logger = Logger.get('DataProcessingView.tsx', 'info');

const t = prefixedTranslation('DataProcessingView:');

function DataProcessingView() {
  const { toasts } = useServices();
  const modules = ModuleRegistry.get().getAllModules();
  const loadedModules = useAppSelector((st) => st.ui.modulesLoaded);
  const activeModuleId = useParams<DataProcessingParams>().moduleId;
  const activeModule = modules.find((mod) => mod.getId() === activeModuleId);
  const dispatch = useAppDispatch();
  const [updateKey, setUpdateKey] = useState(0);
  const location = useLocation();
  const lang = getLang();

  // Page setup
  useEffect(() => pageSetup(t('Data_processing'), t('Visualize_data_on_map')), []);

  // Grab values from query string at init
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.getAll('url').length) {
      dispatch(UiActions.setRemoteModuleUrls(params.getAll('url')));
    }
  }, [dispatch, location.search]);

  const updateRemoteModules = useCallback(() => {
    ModuleRegistry.get()
      .loadRemoteModules()
      .then(() => setUpdateKey(updateKey + 1))
      .catch((err) => {
        toasts.genericError();
        logger.error('Update error: ', err);
      });
  }, [toasts, updateKey]);

  return (
    <div className={Cls.dataProcessingView}>
      {/* Module selection menu on right */}
      <SideMenu
        buttonIcon={IconDefs.faList}
        buttonStyle={{ top: '50vh', right: '6vmin' }}
        title={t('Modules')}
        menuPlacement={'right'}
        menuId={'views/DataProcessingView'}
        initiallyOpened={isDesktopDevice()}
        data-cy={'modules-menu'}
      >
        <div key={loadedModules.join('-')} className={Cls.rightMenu}>
          <div className={'mx-2 my-4 fw-bold'}>{t('Modules')}</div>
          {modules.map((mod) => {
            const to = Routes.dataProcessing().withParams({ moduleId: mod.getId() });
            return (
              <Link key={mod.getId()} className={'btn btn-link mb-1'} to={to} data-cy={mod.getId()}>
                {mod.getReadableName()}
              </Link>
            );
          })}
        </div>
      </SideMenu>

      {/* Reload button on right, only for remote modules */}
      {activeModule && ModuleRegistry.get().isRemote(activeModule) && (
        <FloatingButton
          icon={IconDefs.faRedo}
          title={t('Reload_module')}
          onClick={updateRemoteModules}
          style={{
            top: '40vh',
            right: '6vmin',
          }}
        />
      )}

      {/* Module content */}
      <div className={Cls.viewPort} data-cy={'data-processing-viewport'} key={`${activeModuleId}-${updateKey}`}>
        <ModuleErrorBoundary>
          {activeModule && (
            <>
              <h4 className={'my-3'} data-cy={'module-title'}>
                {activeModule.getReadableName()}
              </h4>
              {React.cloneElement(activeModule.getUserInterface(), { lang })}
            </>
          )}
          {!activeModule && (
            <div className={Cls.welcome}>
              <FaIcon icon={IconDefs.faCogs} size={'6rem'} className={'mb-3'} />
              <h4 dangerouslySetInnerHTML={{ __html: t('Select_a_module_on_right') }} />
            </div>
          )}
        </ModuleErrorBoundary>
      </div>
    </div>
  );
}

export default withTranslation()(DataProcessingView);
