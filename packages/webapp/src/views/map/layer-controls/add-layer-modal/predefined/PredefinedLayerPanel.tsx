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

import React, { useCallback } from 'react';
import { BundledModuleId, Logger, PredefinedLayerModel } from '@abc-map/shared';
import ControlButtons from '../_common/ControlButtons';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import { useTranslation } from 'react-i18next';
import Cls from './PredefinedLayerPanel.module.scss';
import { useServices } from '../../../../../core/useServices';
import OsmPreview from './osm-preview.jpg';
import { Link } from 'react-router-dom';
import { Routes } from '../../../../../routes';
import { FaIcon } from '../../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../../components/icon/IconDefs';

const logger = Logger.get('PredefinedLayerPanel.tsx');

interface Props {
  value: PredefinedLayerModel;
  onChange: (m: PredefinedLayerModel) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const byOsm = '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
const osmLicense = '<a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA 2.0</a>';

export function PredefinedLayerPanel(props: Props) {
  const { value, onCancel, onConfirm } = props;
  const { t } = useTranslation('MapView');
  const { history } = useServices();

  const handleConfirm = useCallback(() => {
    const add = async () => {
      const layer = LayerFactory.newPredefinedLayer(value);

      const cs = AddLayersChangeset.create([layer]);
      await cs.execute();
      history.register(HistoryKey.Map, cs);

      onConfirm();
    };

    add().catch((err) => logger.error('Cannot add layer', err));
  }, [history, onConfirm, value]);

  return (
    <div className={'flex-grow-1 d-flex flex-column'}>
      <div className={'mb-5'}>{t('Nothing_to_configure_here')} ✌️</div>

      <div className={'d-flex justify-content-center mb-2'}>
        <img src={OsmPreview} alt={t('OpenStreetMap_basemap')} className={Cls.preview} />
      </div>

      <small className={'text-center mb-5'}>
        <span dangerouslySetInnerHTML={{ __html: byOsm }} />
        <span className={'ms-2'} dangerouslySetInnerHTML={{ __html: osmLicense }} />
      </small>

      <div className={'alert alert-info d-flex align-items-center'}>
        <FaIcon icon={IconDefs.faInfoCircle} className={'me-2'} />
        {t('Looking_for_another_basemap')} &nbsp;
        <Link to={Routes.module().withParams({ moduleId: BundledModuleId.DataStore })}>{t('Try_data_store')}</Link>
      </div>

      <div className={'flex-grow-1'} />

      {/* Control buttons */}
      <ControlButtons onCancel={onCancel} onConfirm={handleConfirm} />
    </div>
  );
}
