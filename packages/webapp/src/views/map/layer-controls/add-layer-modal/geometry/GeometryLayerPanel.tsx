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

import type { ReactNode } from 'react';
import React, { Component } from 'react';
import { Logger } from '@abc-map/shared';
import ControlButtons from '../_common/ControlButtons';
import type { ServiceProps } from '../../../../../core/withServices';
import { withServices } from '../../../../../core/withServices';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import type { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';

const logger = Logger.get('GeometryLayerPanel.tsx');

interface Props extends ServiceProps, WithTranslation {
  onCancel: () => void;
  onConfirm: () => void;
}

class GeometryLayerPanel extends Component<Props, unknown> {
  public render(): ReactNode {
    const t = this.props.i18n.getFixedT(this.props.i18n.language, 'MapView');
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
    const { history } = this.props.services;

    const add = async () => {
      const layer = LayerFactory.newVectorLayer();

      const cs = AddLayersChangeset.create([layer]);
      await cs.execute();
      history.register(HistoryKey.Map, cs);

      this.props.onConfirm();
    };

    add().catch((err) => logger.error('Cannot add layer: ', err));
  };
}

export default withTranslation()(withServices(GeometryLayerPanel));
