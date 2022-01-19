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
import { Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { addNoIndexMeta, pageSetup, removeNoIndexMeta } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import Cls from './NotFoundView.module.scss';
import { Routes } from '../../routes';

const logger = Logger.get('NotFoundView.tsx');

const t = prefixedTranslation('NotFoundView:');

class NotFoundView extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.notFoundView}>
        <h3 className={'mb-5'}>{t('You_are_lost')} 😱</h3>
        <Link to={Routes.landing().format()}>{t('Dont_panic')}&nbsp;&nbsp;💁🏽</Link>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(`404 - ${t('You_are_lost')}`);
    addNoIndexMeta();
  }

  public componentWillUnmount() {
    removeNoIndexMeta();
  }
}

export default NotFoundView;
