/**
 * Copyright © 2026 Rémi Pace.
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
import Cls from './ModuleView.module.scss';
import React, { useCallback, useEffect, useMemo } from 'react';
import type { ModuleParams } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { useNavigate, useParams } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { useTranslation, withTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { UiActions } from '../../store/ui/actions';
import ModuleErrorBoundary from './ModuleErrorBoundary';
import { ModuleRegistry } from '../../core/modules/registry/ModuleRegistry';
import { Routes } from '../../routes';

const logger = Logger.get('ModuleView.tsx', 'info');

function ModuleView() {
  const registry = ModuleRegistry.get();
  const activeModuleId = useParams<ModuleParams>().moduleId;
  const activeModule = useMemo(() => registry.getModules().find((mod) => mod.getId() === activeModuleId), [activeModuleId, registry]);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('ModuleView');
  const navigate = useNavigate();

  // Page setup
  useEffect(() => pageSetup(activeModule?.getReadableName() || ''), [activeModule]);

  // Register usage for frequently used modules
  useEffect(() => {
    if (activeModuleId) {
      dispatch(UiActions.registerModuleUsage(activeModuleId));
    }
  }, [activeModuleId, dispatch]);

  const ModuleUi = useMemo(() => activeModule?.getView(), [activeModule]);
  const handleShowIndex = useCallback(() => navigate(Routes.moduleIndex().format()), [navigate]);

  return (
    <div className={Cls.view}>
      {/* Module is known, we display its UI */}
      {activeModule && (
        <div className={Cls.moduleViewPort} key={activeModuleId} data-cy={'module-viewport'}>
          <ModuleErrorBoundary>
            {/* Display module ui if any */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            {ModuleUi && <ModuleUi />}

            {/* No module UI, display error */}
            {!ModuleUi && (
              <div className={'h-100 d-flex flex-column justify-content-center align-items-center'}>
                <h2>{t('Something_went_wrong')} 😅</h2>
                <div>{t('This_module_does_not_work_correctly')}</div>
              </div>
            )}
          </ModuleErrorBoundary>
        </div>
      )}

      {/* Module is unknown, we display an error */}
      {!activeModule && (
        <div className={'h-100 d-flex flex-column justify-content-center align-items-center'} data-cy={'module-viewport'}>
          <h2 className={'mb-4'}>{t('Unknown_module')} 😕</h2>
          <button onClick={handleShowIndex} className={'btn btn-link'}>
            {t('Maybe_you_will_find_what_you_are_looking_for_here')}
          </button>
        </div>
      )}
    </div>
  );
}

export default withTranslation()(ModuleView);
