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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Logger } from '@abc-map/shared';
import MainIcon from '../../assets/main-icon.svg';
import { Routes } from '../../routes';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLinks } from './useLinks';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import clsx from 'clsx';
import { TopBarLink } from './link/TopBarLink';
import { getRemSize } from '../../core/ui/getRemSize';
import { ResizeObserverFactory } from '../../core/utils/ResizeObserverFactory';
import debounce from 'lodash/debounce';
import { MainMenu } from './MainMenu';

const logger = Logger.get('TopBar.tsx');

function TopBar() {
  const { t } = useTranslation('TopBar');
  const navigate = useNavigate();
  const { topBarLinks } = useLinks();

  const handleGoToLanding = useCallback(() => navigate(Routes.landing().format()), [navigate]);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggleMenu = useCallback(() => setMenuOpen(!menuOpen), [menuOpen]);

  const [displayTopBarLinks, setDisplayTopBarLinks] = useState(false);

  // We adapt number of links to UI
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      logger.warn('Not ready');
      return;
    }

    const adaptDisplay = () => {
      // Since links are dynamic, we estimate the size of all links before display. If all the links measure
      // less than 70% of the top bar we display them all, we don't display them
      const estimatedLinkSizeRem = 12 * getRemSize();
      const linksLength = topBarLinks.length * estimatedLinkSizeRem;
      const availableLength = container.clientWidth;
      const enoughSpace = linksLength / availableLength < 0.75;
      setDisplayTopBarLinks(enoughSpace);
    };

    adaptDisplay();

    const observer = ResizeObserverFactory.create(debounce(adaptDisplay, 100));
    observer.observe(container);
    return () => observer.disconnect();
  }, [topBarLinks.length]);

  return (
    <div className={Cls.topBar} ref={containerRef} data-cy={'top-bar'}>
      {/* Abc-Map icon */}
      <button onClick={handleGoToLanding} data-cy={'landing'} className={Cls.brand}>
        <img src={MainIcon} alt={'Logo'} />
        <span>Abc-Map</span>
      </button>

      {/* Favorites modules, if enough places */}
      {displayTopBarLinks &&
        topBarLinks.map((link) => (
          <TopBarLink key={link.to} to={link.to} display={'horizontal'} activeMatch={link.activeMatch} className={clsx(Cls.link, 'me-2')} data-cy={link.dataCy}>
            {link.label}
          </TopBarLink>
        ))}

      <div className={'flex-grow-1'} />

      {/* Open menu button */}
      <button onClick={handleToggleMenu} className={'btn btn-link d-flex align-items-center justify-content-center me-3'} data-cy={'open-main-menu'}>
        <span className={'me-3 mb-1 fw-bold'}>{t('Menu')}</span>
        <FaIcon icon={IconDefs.faMapSigns} size={'2rem'} />
      </button>

      {/* When main menu is open, we show a blurry background */}
      <div onClick={handleToggleMenu} className={clsx(Cls.backdrop, menuOpen && Cls.visible)} />

      <MainMenu open={menuOpen} onToggleMenu={handleToggleMenu} />
    </div>
  );
}

export default TopBar;
