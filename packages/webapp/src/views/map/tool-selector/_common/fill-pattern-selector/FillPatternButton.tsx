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

import React, { useCallback, useEffect, useRef } from 'react';
import { Logger } from '@abc-map/shared';
import { FillPatterns } from '@abc-map/shared';
import { LabeledFillPatterns } from './LabeledFillPatterns';
import { FillPatternFactory } from '../../../../../core/geo/styles/FillPatternFactory';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './FillPatternButton.module.scss';
import { getRemSize } from '../../../../../core/ui/getRemSize';

const logger = Logger.get('FillPatternButton.tsx', 'info');

export interface Props {
  size: 'sm' | 'lg';
  pattern: FillPatterns;
  color1: string;
  color2: string;
  onClick: (ev: FillPatterns) => void;
  factory?: FillPatternFactory;
}

const t = prefixedTranslation('MapView:');

function FillPatternButton(props: Props) {
  const { size, onClick, pattern, color1, color2 } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const factoryRef = useRef(props.factory || new FillPatternFactory());

  const labeledPattern = LabeledFillPatterns.All.find((p) => p.value === pattern);
  const title = t(labeledPattern?.i18nLabel || 'No_name');

  const handleClick = useCallback(() => onClick(pattern), [onClick, pattern]);

  const preview = useCallback(() => {
    const patternFactory = factoryRef?.current;
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!patternFactory || !canvas || !ctx) {
      logger.error('Cannot preview, not ready');
      return;
    }

    if (FillPatterns.Flat === pattern) {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const canvasPattern = factoryRef.current.create({ pattern, color1, color2 });
    if (!canvasPattern) {
      logger.error(`Invalid pattern: ${pattern}`);
      return;
    }

    // First we erase previous pattern
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Then we draw pattern
    ctx.fillStyle = canvasPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [color1, color2, pattern]);

  useEffect(() => preview(), [pattern, color1, color2, preview]);

  const sizeRem = size === 'sm' ? 3 : 8;
  const paddingRem = size === 'sm' ? 0.6 : 0.8;
  const remPx = getRemSize() || 15;
  const buttonSize = remPx * sizeRem;
  const canvasSize = remPx * sizeRem - remPx * paddingRem;

  return (
    <button onClick={handleClick} title={title} className={Cls.fillPatternButton} style={{ width: buttonSize, height: buttonSize }}>
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
    </button>
  );
}

export default withTranslation()(FillPatternButton);
