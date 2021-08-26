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
import { AbcLegend, Logger } from '@abc-map/shared';
import { LegendRenderer } from '../../../core/project/rendering/LegendRenderer';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import Cls from './LegendPreview.module.scss';

const logger = Logger.get('LegendPreview.tsx');

interface Props {
  legend: AbcLegend;
  onSizeChanged: (width: number, height: number) => void;
}

class LegendPreview extends Component<Props, {}> {
  private legendRenderer = new LegendRenderer();
  private preview = React.createRef<HTMLCanvasElement>();

  public render(): ReactNode {
    const width = this.props.legend.width;
    const height = this.props.legend.height;

    return (
      <ResizableBox width={width} height={height} onResize={this.handleResize}>
        <>
          <canvas ref={this.preview} width={width} height={height} />
          <div className={Cls.help}>Déplacez ce coin pour redimensionner ⬆️</div>
        </>
      </ResizableBox>
    );
  }

  public componentDidMount() {
    this.renderPreview();
  }

  public componentDidUpdate() {
    this.renderPreview();
  }

  private handleResize = (e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    this.props.onSizeChanged(Math.round(size.width), Math.round(size.height));
  };

  private renderPreview = () => {
    if (!this.preview.current) {
      logger.error('Cannot preview legend, canvas not ready');
      return;
    }

    this.legendRenderer.renderLegend(this.props.legend, this.preview.current, 1).catch((err) => logger.error('Rendering error: ', err));
  };
}

export default LegendPreview;
