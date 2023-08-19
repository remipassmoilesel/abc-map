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
import Cls from './ModuleView.module.scss';
import React, { LazyExoticComponent, Suspense, ReactElement, useCallback, useEffect, useMemo } from 'react';
import { Logger, ModuleParams } from '@abc-map/shared';
import { useNavigate, useParams } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { useTranslation, withTranslation } from 'react-i18next';
import { useAppDispatch } from '../../core/store/hooks';
import { UiActions } from '../../core/store/ui/actions';
import ModuleErrorBoundary from './ModuleErrorBoundary';
import { ModuleRegistry } from '../../core/modules/registry/ModuleRegistry';
import { Routes } from '../../routes';

const logger = Logger.get('ModuleView.tsx', 'info');

function ModuleView() {
  const registry = ModuleRegistry.get();
  const activeModuleId = useParams<ModuleParams>().moduleId;
  const activeModule = useMemo(() => registry.getModules().find((mod) => mod.getId() === activeModuleId), [activeModuleId, registry]);
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation('ModuleView');
  const navigate = useNavigate();

  // Page setup
  useEffect(() => pageSetup(activeModule?.getReadableName() || ''), [activeModule]);

  // Register usage for frequently used modules
  useEffect(() => {
    activeModuleId && dispatch(UiActions.registerModuleUsage(activeModuleId));
  }, [activeModuleId, dispatch]);

  const moduleUi = activeModule?.getView();
  const SyncUi = isReactElement(moduleUi) ? moduleUi : null;
  const LazyUi = isLazyComponent(moduleUi) ? moduleUi : null;

  const handleShowIndex = useCallback(() => navigate(Routes.moduleIndex().format()), [navigate]);

  return (
    <div className={Cls.view}>
      {/* Module is known, we display its UI */}
      {activeModule && (
        <div className={Cls.moduleViewPort} key={activeModuleId} data-cy={'module-viewport'}>
          <ModuleErrorBoundary>
            {/* Display module ui if any */}
            {SyncUi && React.cloneElement(SyncUi, { lang: i18n.language })}

            {LazyUi && (
              // FIXME: With this implementation, UI may "flicker".
              // FIXME: We can implement a fix like https://github.com/HanMoeHtet/route-level-code-split
              <Suspense>
                <LazyUi />
              </Suspense>
            )}

            {/* No module UI, display error */}
            {!moduleUi && (
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

function isLazyComponent(comp: unknown): comp is LazyExoticComponent<any> {
  return comp !== null && typeof comp === 'object' && '$$typeof' in comp && comp?.$$typeof?.toString() === 'Symbol(react.lazy)';
}

function isReactElement(comp: unknown): comp is ReactElement {
  return comp !== null && typeof comp === 'object' && '$$typeof' in comp && comp?.$$typeof?.toString() === 'Symbol(react.element)';
}

export default withTranslation()(ModuleView);
