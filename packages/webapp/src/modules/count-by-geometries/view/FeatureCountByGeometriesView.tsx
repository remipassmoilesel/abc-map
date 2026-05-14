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

import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import Cls from './FeatureCountByGeometriesView.module.scss';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';

const logger = Logger.get('FeatureCountByGeometriesView.tsx');

type Props = WithTranslation;

class FeatureCountByGeometriesView extends Component<Props, unknown> {
  public render() {
    const t = this.props.i18n.getFixedT(this.props.i18n.language, 'FeatureCountByGeometriesModule');

    return (
      <div className={Cls.panel}>
        <FaIcon icon={IconDefs.faFileCode} size={'4rem'} />
        <h4 className={'text-center my-5'}>{t('Module_not_terminated')}</h4>
        <div className={'text-center'}>{t('This_module_will')}</div>
      </div>
    );
  }
}

export default withTranslation()(FeatureCountByGeometriesView);
