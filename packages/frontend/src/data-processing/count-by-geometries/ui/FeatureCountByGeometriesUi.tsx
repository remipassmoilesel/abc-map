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
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from './FeatureCountByGeometriesUI.module.scss';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('CountPointsInPolygonUi.tsx');

const t = prefixedTranslation('DataProcessingModules:FeatureCountByGeometries.');

class FeatureCountByGeometriesUi extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.panel}>
        <i className={`fa fa-file-code`} />
        <h4 className={'text-center my-5'}>{t('Module_not_terminated')}</h4>
        <div>{t('This_module_will')}</div>
      </div>
    );
  }
}

export default withTranslation()(FeatureCountByGeometriesUi);
