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
import { WmtsLayer } from '../../../../../core/geo/WmtsCapabilities';
import Cls from './WmtsLayerItem.module.scss';

const logger = Logger.get('WmtsLayerItem.tsx');

interface Props {
  layer: WmtsLayer;
  selected: boolean;
  onSelected: (lay: WmtsLayer) => void;
}

class WmtsLayerItem extends Component<Props, {}> {
  public render(): ReactNode {
    const layer = this.props.layer;
    const classes = this.props.selected ? `${Cls.wmtsLayerItem} ${Cls.selected}` : Cls.wmtsLayerItem;
    return (
      <div className={classes} onClick={this.handleClick} data-cy={'wmts-layer-item'}>
        <div className={'fw-bold'}>{layer.Title}</div>
        <small>{layer.Abstract}</small>
      </div>
    );
  }

  private handleClick = () => {
    this.props.onSelected(this.props.layer);
  };
}

export default WmtsLayerItem;