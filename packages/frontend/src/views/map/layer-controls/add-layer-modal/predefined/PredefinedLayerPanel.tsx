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

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger, PredefinedLayerModel } from '@abc-map/shared';
import { LabeledPredefinedModels } from './LabeledPredefinedModels';
import ControlButtons from '../_common/ControlButtons';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './PredefinedLayerPanel.module.scss';

const logger = Logger.get('PredefinedLayerPanel.tsx');

interface Props extends ServiceProps {
  value: PredefinedLayerModel;
  onChange: (m: PredefinedLayerModel) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const t = prefixedTranslation('MapView:AddLayerModal.');

class PredefinedLayerPanel extends Component<Props, {}> {
  public render(): ReactNode {
    const model = this.props.value;
    const labelledModel = LabeledPredefinedModels.find(model);
    const onCancel = this.props.onCancel;

    return (
      <div className={'flex-grow-1 d-flex flex-column'}>
        <div className={'mb-3'}>{t('Select_basemap_you_want')} :</div>
        <select value={model} onChange={this.handleChange} className={'form-select mb-3'} data-cy={'predefined-model'}>
          {LabeledPredefinedModels.All.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <div className={'mb-2'}>{t('Preview')} : </div>
        <div className={'d-flex justify-content-center mb-4'}>
          <img src={labelledModel?.preview} width={440} alt={labelledModel?.label} className={Cls.preview} />
        </div>
        <div className={'text-center'}>
          {t('Origin_of_data_license')}:&nbsp;
          <span dangerouslySetInnerHTML={{ __html: labelledModel?.by || '' }} />
          <span className={'ml-2'} dangerouslySetInnerHTML={{ __html: labelledModel?.license || '' }} />
        </div>

        <div className={'flex-grow-1'} />

        {/* Control buttons */}
        <ControlButtons onCancel={onCancel} onConfirm={this.handleConfirm} />
      </div>
    );
  }

  private handleConfirm = () => {
    const { geo, history } = this.props.services;
    const { value } = this.props;

    const add = async () => {
      const map = geo.getMainMap();
      const layer = LayerFactory.newPredefinedLayer(value);

      const cs = new AddLayersChangeset(map, [layer]);
      await cs.apply();
      history.register(HistoryKey.Map, cs);

      map.setActiveLayer(layer);
      this.props.onConfirm();
    };

    add().catch((err) => logger.error('Cannot add layer', err));
  };

  private handleChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value as PredefinedLayerModel;
    this.props.onChange(value);
  };
}

export default withTranslation()(withServices(PredefinedLayerPanel));
