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

import React from 'react';
import { BundledModuleId, LayerType, Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Routes } from '../../../../../routes';
import Cls from './HelpPanel.module.scss';
import clsx from 'clsx';

const logger = Logger.get('HelpPanel.tsx');

interface Props {
  type: LayerType;
}

export function HelpPanel(props: Props) {
  const { type } = props;
  const { t } = useTranslation('MapView');

  return (
    <div className={Cls.help}>
      <div className={'mb-2'}>{t('What_is_this')}</div>

      <div className={'mb-5'}>
        {type === LayerType.Predefined && <div>{t('Basemap_are_easy_to_use')}</div>}
        {type === LayerType.Vector && <div>{t('Geometry_layers_contain_shapes')}</div>}
        {type === LayerType.Wms && <div>{t('A_XXX_layer_is_a_basemap_that_use', { name: 'WMS', protocol: 'WMS' })}</div>}
        {type === LayerType.Wmts && <div>{t('A_XXX_layer_is_a_basemap_that_use', { name: 'WMTS', protocol: 'WMTS' })}</div>}
        {type === LayerType.Xyz && <div>{t('A_XXX_layer_is_a_basemap_that_use', { name: 'XYZ', protocol: 'HTTP REST' })}</div>}
      </div>

      <div className={clsx(Cls.datastoreAdvice, 'd-flex flex-row flex-wrap align-items-center mb-5')}>
        <div className={'me-2'}>{t('Cant_find_what_you_re_looking_for')}</div>
        <Link to={Routes.module().withParams({ moduleId: BundledModuleId.DataStore })}>{t('Try_data_store')}</Link>
      </div>
    </div>
  );
}
