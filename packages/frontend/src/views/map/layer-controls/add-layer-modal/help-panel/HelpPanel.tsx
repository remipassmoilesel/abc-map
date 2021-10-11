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
import { FrontendRoutes, LayerType, Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './HelpPanel.module.scss';

const logger = Logger.get('HelpPanel.tsx');

interface Props {
  type: LayerType;
}

const t = prefixedTranslation('MapView:AddLayerModal.');

class HelpPanel extends Component<Props, {}> {
  public render(): ReactNode {
    const type = this.props.type;

    return (
      <div className={Cls.help}>
        {type === LayerType.Predefined && <div>{t('Basemap_are_easy_to_use')}</div>}
        {type === LayerType.Vector && <div>{t('Geometry_layers_allow_to_draw')}</div>}

        <div className={Cls.datastoreAdvice}>
          <i className={'fa fa-info-circle mr-3'} />
          <div>
            {t('Cant_find_what_you_want')}
            <br />
            <Link to={FrontendRoutes.dataStore().raw()}>{t('Try_data_store')}</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(HelpPanel);
