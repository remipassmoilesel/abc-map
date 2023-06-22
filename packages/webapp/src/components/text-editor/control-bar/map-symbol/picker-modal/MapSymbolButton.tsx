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
import { StyleCacheEntry } from '../../../../../core/geo/styles/StyleCache';
import { Logger } from '@abc-map/shared';
import { MapSymbolRenderer } from '../../../../../core/project/rendering/MapSymbolRenderer';
import Cls from './MapSymbolButton.module.scss';

const logger = Logger.get('MapSymbolButton');

interface Props {
  style: StyleCacheEntry;
  onClick: (st: StyleCacheEntry) => void;
}

class MapSymbolButton extends Component<Props, {}> {
  private renderer = new MapSymbolRenderer();
  private canvas = React.createRef<HTMLCanvasElement>();

  public render(): ReactNode {
    return (
      <button onClick={this.handleClick} className={`btn btn-outline-secondary ${Cls.button}`} data-cy={'map-symbol'}>
        <canvas ref={this.canvas} />
      </button>
    );
  }

  public componentDidMount() {
    const canvas = this.canvas.current;
    if (!canvas) {
      logger.error('Cannot draw symbol button, canvas not ready');
      return;
    }

    const style = this.props.style;
    const dimensions = this.renderer.symbolSizeForStyle(style.style, style.geomType, 1);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    this.renderer.renderSymbol(style.style, style.geomType, canvas, 1).catch((err) => logger.error('Render error: ', err));
  }

  private handleClick = () => {
    this.props.onClick(this.props.style);
  };
}

export default MapSymbolButton;
