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

import React, { useCallback, useEffect, useRef } from 'react';
import { StyleCacheEntry } from '../../../../../core/geo/styles/StyleCache';
import { Logger } from '@abc-map/shared';
import { MapSymbolRenderer } from '../../../../../core/project/rendering/MapSymbolRenderer';
import Cls from './MapSymbolButton.module.scss';
import clsx from 'clsx';
import { IconProcessor } from '../../../../../core/point-icons/IconProcessor';

const logger = Logger.get('MapSymbolButton.tsx');

interface Props {
  style: StyleCacheEntry;
  onClick: (st: StyleCacheEntry) => void;
}

export function MapSymbolButton(props: Props) {
  const { style, onClick } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        logger.error('Cannot draw symbol button, canvas not ready');
        return;
      }

      const renderer = new MapSymbolRenderer();
      renderer
        .symbolSizeForStyle(style.style, style.geomType, 1)
        .then((dimensions) => {
          // We render only if dimensions returned, otherwise image is not yet ready
          if (dimensions) {
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            return renderer.renderSymbol(style.style, style.geomType, canvas, 1);
          }
        })
        .catch((err) => logger.error('Cannot render legend item: ', err));
    };

    render();
    IconProcessor.get().addEventListener(render);
    return () => IconProcessor.get().removeEventListener(render);
  }, [style.geomType, style.style]);

  const handleClick = useCallback(() => onClick(style), [onClick, style]);

  return (
    <button onClick={handleClick} className={clsx(`btn btn-outline-secondary`, Cls.button)} data-cy={'map-symbol'}>
      <canvas ref={canvasRef} />
    </button>
  );
}
