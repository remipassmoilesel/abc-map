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

import React, { useCallback, useState } from 'react';
import { Logger } from '@abc-map/shared';
import TopBarLink from './link/TopBarLink';
import MainIcon from '../../assets/main-icon.svg';
import LangSelector from './lang-selector/LangSelector';
import UserMenu from './user-menu/UserMenu';
import { prefixedTranslation } from '../../i18n/i18n';
import Cls from './TopBar.module.scss';
import { Routes } from '../../routes';
import { useHistory } from 'react-router-dom';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { useAppSelector } from '../../core/store/hooks';
import { MapSharing } from '../../ExperimentalFeatures';

const logger = Logger.get('TopBar.tsx');

const t = prefixedTranslation('TopBar:');

function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const history = useHistory();
  const goToLanding = useCallback(() => history.push(Routes.landing().format()), [history]);

  const linksClasses = `${Cls.links} ${mobileOpen ? Cls.open : ''}`;
  const withSharing = useAppSelector((st) => st.ui.experimentalFeatures[MapSharing.id]) ?? false;

  return (
    <div className={Cls.topBar} data-cy={'top-bar'}>
      <button onClick={goToLanding} data-cy={'landing'} className={Cls.brand}>
        <img src={MainIcon} alt={'Logo'} />
        <span>Abc-Map</span>
      </button>

      <div className={Cls.spacer} />

      <div className={linksClasses} onClick={() => setMobileOpen(false)}>
        <h1 className={Cls.menuTitle}>{t('Menu')}</h1>
        <TopBarLink label={t('Map')} to={Routes.map().format()} data-cy={'map'} />
        <TopBarLink label={t('Data_store')} to={Routes.dataStore().format()} data-cy={'data-store'} />
        <TopBarLink label={t('Data_processing')} to={Routes.dataProcessing().format()} data-cy={'data-processing'} />
        <TopBarLink label={t('Export')} to={Routes.export().format()} data-cy={'export'} />
        {withSharing && <TopBarLink label={t('Share')} to={Routes.shareSettings().format()} data-cy={'share'} />}
        <TopBarLink label={t('Documentation')} to={Routes.documentation().format()} data-cy={'help'} />
        <TopBarLink label={`${t('Support_AbcMap')} 💌`} to={Routes.funding().format()} data-cy={'help'} />
      </div>

      {/* Open menu button, only visible on mobile devices */}
      <button onClick={() => setMobileOpen(!mobileOpen)} className={Cls.openButton}>
        {t('Menu')} <FaIcon icon={IconDefs.faMapSigns} size={'1.4rem'} className={'ml-3'} />
      </button>

      <LangSelector />
      <UserMenu />
    </div>
  );
}

export default TopBar;
