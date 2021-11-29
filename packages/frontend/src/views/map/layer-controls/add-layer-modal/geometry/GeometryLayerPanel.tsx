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
import ControlButtons from '../_common/ControlButtons';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import { prefixedTranslation } from '../../../../../i18n/i18n';

const logger = Logger.get('GeometryLayerPanel.tsx');

interface Props extends ServiceProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const t = prefixedTranslation('MapView:AddLayerModal.');

class GeometryLayerPanel extends Component<Props, {}> {
  public render(): ReactNode {
    const onCancel = this.props.onCancel;

    return (
      <div className={'flex-grow-1 d-flex flex-column justify-content-between'}>
        <div>{t('Nothing_to_configure_here')} ✌️</div>

        {/* Control buttons */}
        <ControlButtons onCancel={onCancel} onConfirm={this.handleConfirm} />
      </div>
    );
  }

  private handleConfirm = () => {
    const { geo, history } = this.props.services;

    const add = async () => {
      const map = geo.getMainMap();
      const layer = LayerFactory.newVectorLayer();

      const cs = new AddLayersChangeset(map, [layer]);
      await cs.apply();
      history.register(HistoryKey.Map, cs);

      map.setActiveLayer(layer);
      this.props.onConfirm();
    };

    add().catch((err) => logger.error('Cannot add layer: ', err));
  };
}

export default withServices(GeometryLayerPanel);
