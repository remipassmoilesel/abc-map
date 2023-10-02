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

import React, { CSSProperties, ReactNode, useMemo } from 'react';
import { Routes } from '../../routes';
import Grid from './grid.svg';
import { useActiveModule, useFavoriteModules } from '../../core/modules/hooks';
import { useTranslation } from 'react-i18next';
import { BundledModuleId } from '@abc-map/shared';
import uniqBy from 'lodash/uniqBy';

interface LinkDef {
  to: string;
  activeMatch?: RegExp;
  label: ReactNode | ReactNode[] | string;
  dataCy?: string;
}

interface Result {
  menuLinks: LinkDef[];
  topBarLinks: LinkDef[];
}

export function useLinks(): Result {
  const { t } = useTranslation('TopBar');
  const favoriteModules = useFavoriteModules().slice(0, 20);
  const imageSize: CSSProperties = useMemo(() => ({ width: '1.3rem' }), []);
  const { module: activeModule } = useActiveModule();

  const activeModuleLinkDef: LinkDef | undefined = useMemo(() => {
    if (!activeModule) {
      return;
    }

    return {
      to: Routes.module().withParams({ moduleId: activeModule.getId() }),
      label: activeModule.getReadableName(),
    };
  }, [activeModule]);

  const funding: LinkDef = useMemo(() => {
    return {
      to: Routes.funding().format(),
      label: `${t('Support_AbcMap')} 💌`,
    };
  }, [t]);

  const moduleIndex: LinkDef = useMemo(
    () => ({
      to: Routes.moduleIndex().format(),
      label: (
        <>
          <span className={'me-2'}>{t('Plus')}</span> <img src={Grid} alt={t('Plus')} style={imageSize} />
        </>
      ),
      activeMatch: /^\/[a-z]{2}\/modules$/gi,
      dataCy: 'module-index',
    }),
    [imageSize, t]
  );

  const map: LinkDef = useMemo(() => {
    return {
      to: Routes.map().format(),
      label: t('Map'),
      dataCy: 'map',
    };
  }, [t]);

  const favorites = useMemo(
    () =>
      favoriteModules.map((mod) => ({
        to: Routes.module().withParams({ moduleId: mod.getId() }),
        label: mod.getReadableName(),
        dataCy: `top-bar-link_${mod.getId()}`,
      })),
    [favoriteModules]
  );

  // Menu links
  // These links are used in side menu. Some links are static (Map, documentation, ...).
  // We always include current module link in order to show module name even if it is not a favorite module.
  const menuLinks: LinkDef[] = useMemo(() => {
    const docRoute = Routes.module().withParams({ moduleId: BundledModuleId.Documentation });
    return uniqBy(
      [
        map,
        {
          to: docRoute,
          label: t('Documentation'),
          dataCy: 'documentation',
        },
        ...favorites.filter((r) => r.to !== docRoute),
        activeModuleLinkDef,
        moduleIndex,
        funding,
      ].filter((link): link is LinkDef => !!link),
      (value) => value.to
    );
  }, [activeModuleLinkDef, favorites, funding, map, moduleIndex, t]);

  // Menu links
  // These links are used in top bar. Some links are static (Map, documentation, ...).
  // We always include current module link in order to show module name even if it is not a favorite module.
  const topBarLinks: LinkDef[] = useMemo(() => {
    return uniqBy(
      [map, ...favorites.slice(0, 5), activeModuleLinkDef, moduleIndex, funding].filter((link): link is LinkDef => !!link),
      (value) => value.to
    );
  }, [activeModuleLinkDef, favorites, funding, map, moduleIndex]);

  return { menuLinks, topBarLinks };
}
