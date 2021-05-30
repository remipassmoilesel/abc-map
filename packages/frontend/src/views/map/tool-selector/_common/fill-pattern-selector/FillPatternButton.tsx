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
import { FillPatterns } from '@abc-map/shared';
import { LabelledFillPatterns } from './LabelledFillPatterns';
import { FillPatternFactory } from '../../../../../core/geo/styles/FillPatternFactory';
import Cls from './FillPatternButton.module.scss';

const logger = Logger.get('FillPatternButton.tsx', 'info');

interface Props {
  width: number;
  height: number;
  pattern?: FillPatterns;
  color1?: string;
  color2?: string;
  onClick: (ev: FillPatterns) => void;
}

interface State {
  patternFactory: FillPatternFactory;
}

class FillPatternButton extends Component<Props, State> {
  private canvas = React.createRef<HTMLCanvasElement>();

  constructor(props: Props) {
    super(props);
    this.state = { patternFactory: new FillPatternFactory() };
  }

  public render(): ReactNode {
    const width = this.props.width;
    const height = this.props.height;
    const padding = 8;
    const title = LabelledFillPatterns.All.find((p) => p.value === this.props.pattern)?.label || 'Pas de nom';

    return (
      <button
        onClick={this.handleClick}
        title={title}
        className={`btn btn-outline-secondary ${Cls.fillPatternButton}`}
        style={{ width: width + 'px', height: height + 'px' }}
      >
        <canvas ref={this.canvas} width={width - padding} height={height - padding} />
      </button>
    );
  }

  public componentDidMount() {
    this.preview();
  }

  public componentDidUpdate() {
    this.preview();
  }

  private handleClick = () => {
    if (!this.props.pattern) {
      logger.error('Pattern not set');
      return;
    }

    this.props.onClick(this.props.pattern);
  };

  private preview() {
    const pattern = this.props.pattern;
    const color1 = this.props.color1;
    const color2 = this.props.color2;
    const canvas = this.canvas.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      logger.error('Canvas not ready');
      return;
    }

    if (FillPatterns.Flat === pattern) {
      ctx.fillStyle = color1 || 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const canvasPattern = this.state.patternFactory.create({
      pattern,
      color1,
      color2,
    });

    if (!canvasPattern) {
      logger.error(`Invalid pattern: ${pattern}`);
      return;
    }

    ctx.fillStyle = canvasPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

export default FillPatternButton;
