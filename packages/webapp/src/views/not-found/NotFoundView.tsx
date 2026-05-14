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

import Cls from './NotFoundView.module.scss';
import type { ReactNode } from 'react';
import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { addNoIndexMeta, pageSetup, removeNoIndexMeta } from '../../core/utils/page-setup';
import { Routes } from '../../routes';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('NotFoundView.tsx');

type Props = WithTranslation;

class NotFoundView extends Component<Props, unknown> {
  public render(): ReactNode {
    const t = this.props.i18n.getFixedT(this.props.i18n.language, 'NotFoundView');

    return (
      <div className={Cls.notFoundView}>
        <h3 className={'mb-5'}>{t('You_are_lost')} 😱</h3>
        <Link to={Routes.landing().format()}>{t('Dont_panic')}&nbsp;&nbsp;💁🏽</Link>
      </div>
    );
  }

  public componentDidMount() {
    const { t } = this.props;

    pageSetup(`404 - ${t('You_are_lost')}`);
    addNoIndexMeta();
  }

  public componentWillUnmount() {
    removeNoIndexMeta();
  }
}

export default withTranslation()(NotFoundView);
