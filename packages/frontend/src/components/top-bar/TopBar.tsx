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

import Cls from './TopBar.module.scss';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { TopBarLink } from './link/TopBarLink';
import MainIcon from '../../assets/main-icon.svg';
import LangSelector from './lang-selector/LangSelector';
import { UserMenu } from './user-menu/UserMenu';
import { Routes } from '../../routes';
import { useHistory } from 'react-router-dom';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { SmallOfflineIndicator } from '../offline-indicator/SmallOfflineIndicator';
import { useFavoriteModules } from '../../core/modules/hooks';
import { useTranslation } from 'react-i18next';
import Grid from './grid.svg';
import { getRemSize } from '../../core/ui/getRemSize';
import { ResizeObserverFactory } from '../../core/utils/ResizeObserverFactory';
import debounce from 'lodash/debounce';

const logger = Logger.get('TopBar.tsx');

enum MenuType {
  Static = 'Static',
  Folding = 'Folding',
}

interface LinkDef {
  to: string;
  activeMatch?: RegExp;
  label: ReactNode | ReactNode[] | string;
  dataCy?: string;
}

function TopBar() {
  const { t } = useTranslation('TopBar');
  const history = useHistory();
  const favoriteModules = useFavoriteModules().slice(0, 20);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGoToLanding = useCallback(() => history.push(Routes.landing().format()), [history]);

  const [menuType, setMenuType] = useState(MenuType.Folding);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggleMenu = useCallback(() => setMenuOpen(!menuOpen), [menuOpen]);

  // Links are displayed in two menus: a static one when there is enough space, a folding one when not
  const linkDefs: LinkDef[] = [
    {
      to: Routes.documentation().format(),
      label: t('Documentation'),
      dataCy: 'help',
    },
    {
      to: Routes.map().format(),
      label: t('Map'),
      dataCy: 'map',
    },
    ...favoriteModules.map((mod) => ({
      to: Routes.module().withParams({ moduleId: mod.getId() }),
      label: mod.getReadableName(),
      dataCy: `top-bar-link_${mod.getId()}`,
    })),
    {
      to: Routes.moduleIndex().format(),
      label: (
        <>
          {t('Plus')} <img src={Grid} className={Cls.gridIcon} alt={t('Plus')} />
        </>
      ),
      activeMatch: /^\/[a-z]{2}\/modules$/gi,
      dataCy: 'module-index',
    },
    {
      to: Routes.funding().format(),
      label: `${t('Support_AbcMap')} 💌`,
    },
  ];

  const links = linkDefs.map((link) => (
    <TopBarLink key={link.to} to={link.to} activeMatch={link.activeMatch} className={Cls.link} data-cy={link.dataCy}>
      {link.label}
    </TopBarLink>
  ));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logger.warn('Not ready');
      return;
    }

    const adaptDisplay = () => {
      // Since links are dynamic, we estimate the size of all links before display. If all the links measure
      // less than 70% of the top bar we display them all, otherwise we collapse the menu
      const estimatedLinkSizeRem = 13;
      const linksLength = linkDefs.length * estimatedLinkSizeRem * getRemSize();
      const availableLength = container.clientWidth;
      const enoughSpace = linksLength / availableLength < 0.7;
      if (enoughSpace) {
        setMenuType(MenuType.Static);
      } else {
        setMenuType(MenuType.Folding);
        setMenuOpen(false);
      }
    };

    adaptDisplay();

    const observer = ResizeObserverFactory.create(debounce(adaptDisplay, 100));
    observer.observe(container);
    return () => observer.disconnect();
  }, [linkDefs.length]);

  return (
    <div className={Cls.topBar} ref={containerRef} data-cy={'top-bar'}>
      <button onClick={handleGoToLanding} data-cy={'landing'} className={Cls.brand}>
        <img src={MainIcon} alt={'Logo'} />
        <span>Abc-Map</span>
      </button>

      <SmallOfflineIndicator />

      <div className={Cls.spacer} />

      {MenuType.Static === menuType && <div className={Cls.staticMenu}>{links}</div>}

      {MenuType.Folding === menuType && (
        <div className={Cls.foldingMenu}>
          <button onClick={handleToggleMenu} className={Cls.openButton}>
            <FaIcon icon={IconDefs.faMapSigns} size={'1.4rem'} className={'ml-3'} />
          </button>

          {menuOpen && (
            <div className={Cls.linksPanel} onClick={handleToggleMenu}>
              <h1 className={Cls.menuTitle}>{t('Menu')}</h1>

              <button onClick={handleToggleMenu} className={Cls.closeButton}>
                <FaIcon icon={IconDefs.faTimes} size={'2rem'} />
              </button>

              {links}
            </div>
          )}
        </div>
      )}

      <div className={Cls.verticalBorder} />

      <LangSelector />

      <div className={Cls.verticalBorder} />

      <UserMenu />
    </div>
  );
}

export default TopBar;
