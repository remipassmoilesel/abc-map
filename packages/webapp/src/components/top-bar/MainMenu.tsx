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

import clsx from 'clsx';
import Cls from './MainMenu.module.scss';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { TopBarLink } from './link/TopBarLink';
import { ProjectSection } from './project-section/ProjectSection';
import { AuthenticationSection } from './auth-section/AuthenticationSection';
import React, { useEffect, useRef } from 'react';
import { useLinks } from './useLinks';
import { useTranslation } from 'react-i18next';
import { AppSection } from './app-section/AppSection';
import { Logger } from '@abc-map/shared';
import { LanguageSection } from './language-section/LanguageSection';

interface Props {
  open: boolean;
  onToggleMenu: () => void;
}

const logger = Logger.get('MainMenu.tsx');

export function MainMenu(props: Props) {
  const { t } = useTranslation('TopBar');
  const { open, onToggleMenu: toggleMenu } = props;
  const { menuLinks } = useLinks();
  const containerRef = useRef<HTMLDivElement>(null);

  // When menu open we scroll back to top
  useEffect(() => {
    if (open) {
      containerRef.current?.scrollTo({ top: 0 });
    }
  }, [open]);

  return (
    <div ref={containerRef} className={clsx(Cls.sideMenu, open && Cls.open, 'pb-3')} data-cy={'main-menu'}>
      <div className={'d-flex'}>
        <h5 className={'w-100'}>{t('Links')}</h5>

        <button onClick={toggleMenu} title={t('Close_menu')} className={'btn btn-link float-end'} data-cy={'close-main-menu'}>
          <FaIcon icon={IconDefs.faTimes} size={'2rem'} />
        </button>
      </div>

      {/* Links */}
      <div className={'d-flex flex-wrap'}>
        {menuLinks.map((link) => (
          <TopBarLink
            key={link.to}
            to={link.to}
            display={'vertical'}
            activeMatch={link.activeMatch}
            onClick={toggleMenu}
            className={clsx(Cls.link, 'ms-3 mb-3')}
            data-cy={link.dataCy}
          >
            {link.label}
          </TopBarLink>
        ))}
      </div>

      <h5>{t('My_projects')}</h5>

      <ProjectSection onToggleMenu={toggleMenu} />

      <h5>{t('My_account')}</h5>

      <AuthenticationSection onToggleMenu={toggleMenu} />

      <h5>{t('Application')}</h5>

      <AppSection />

      <LanguageSection className={'mt-3'} />
    </div>
  );
}
