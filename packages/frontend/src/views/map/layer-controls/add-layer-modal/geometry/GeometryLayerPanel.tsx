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
import { AddLayersTask } from '../../../../../core/history/tasks/layers/AddLayersTask';

const logger = Logger.get('GeometryLayerPanel.tsx');

interface Props extends ServiceProps {
  onCancel: () => void;
  onConfirm: () => void;
}

class GeometryLayerPanel extends Component<Props, {}> {
  public render(): ReactNode {
    const onCancel = this.props.onCancel;

    return (
      <div className={'flex-grow-1 d-flex flex-column justify-content-between'}>
        <div>Rien à paramétrer ici ✌️</div>

        {/* Control buttons */}
        <ControlButtons onCancel={onCancel} onConfirm={this.handleConfirm} />
      </div>
    );
  }

  private handleConfirm = () => {
    const { geo, history } = this.props.services;

    const map = geo.getMainMap();
    const layer = LayerFactory.newVectorLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));

    this.props.onConfirm();
  };
}

export default withServices(GeometryLayerPanel);
