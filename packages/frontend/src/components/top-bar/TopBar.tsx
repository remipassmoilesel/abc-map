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

import React, { Component, ReactNode } from 'react';
import { FrontendRoutes, Logger } from '@abc-map/shared';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { ServiceProps, withServices } from '../../core/withServices';
import TopBarLink from './TopBarLink';
import MainIcon from '../../assets/main-icon.svg';
import LangSelector from './lang-selector/LangSelector';
import UserMenu from './user-menu/UserMenu';
import { namespacedTranslation } from '../../i18n/i18n';
import Cls from './TopBar.module.scss';

const logger = Logger.get('TopBar.tsx');

type Props = RouteComponentProps<any> & ServiceProps;

const t = namespacedTranslation('TopBar');

class TopBar extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.topBar} data-cy={'top-bar'}>
        <h1>
          <Link to={FrontendRoutes.landing().raw()} data-cy={'landing'} className={'d-flex align-items-center'}>
            <img src={MainIcon} alt={'Logo'} height={'25'} className={'mr-3'} />
            Abc-Map
          </Link>
        </h1>

        <div className={'flex-grow-1'} />

        <TopBarLink label={t('Map')} to={FrontendRoutes.map().raw()} data-cy={'map'} />
        <TopBarLink label={t('Data_store')} to={FrontendRoutes.dataStore().raw()} data-cy={'data-store'} />
        <TopBarLink label={t('Data_processing')} to={FrontendRoutes.dataProcessing().withoutOptionals()} data-cy={'data-processing'} />
        <TopBarLink label={t('Layout')} to={FrontendRoutes.layout().raw()} data-cy={'layout'} />
        <TopBarLink label={t('Documentation')} to={FrontendRoutes.documentation().raw()} data-cy={'help'} />
        <TopBarLink label={`${t('Support_AbcMap')} 💌`} to={FrontendRoutes.funding().raw()} data-cy={'help'} />

        <div className={'ml-3'}>
          <LangSelector />
        </div>

        <div className={'ml-3'}>
          <UserMenu />
        </div>
      </div>
    );
  }
}

export default withRouter(withServices(TopBar));
