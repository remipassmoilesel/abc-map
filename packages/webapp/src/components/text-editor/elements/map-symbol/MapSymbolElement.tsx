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

import Cls from './MapSymbolElement.module.scss';
import { RenderElementProps } from 'slate-react';
import { MapSymbolRenderer } from '../../../../core/project/rendering/MapSymbolRenderer';
import { useEditor } from '../../useEditor';
import { useEffect, useRef } from 'react';
import { MapSymbolElement as MapSymbolElementDef, Logger } from '@abc-map/shared';
import { StyleFactory } from '../../../../core/geo/styles/StyleFactory';
import { IconProcessor } from '../../../../core/point-icons/IconProcessor';

const logger = Logger.get('MapSymbolElement.tsx');

type Props = RenderElementProps & { element: MapSymbolElementDef };

const styleFactory = StyleFactory.get();

export function MapSymbolElement(props: Props) {
  const { attributes, children, element } = props;
  const { ratio } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        logger.warn('Not ready');
        return;
      }

      const style = styleFactory.getForProperties(element.style, element.geometryType, {
        ratio,
        withSelection: false,
      });

      const renderer = new MapSymbolRenderer();
      renderer
        .symbolSizeForStyle(style, element.geometryType, ratio)
        .then((dimensions) => {
          // We render only if dimensions returned, otherwise image is not yet ready
          if (dimensions) {
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            return renderer.renderSymbol(style, element.geometryType, canvas, ratio);
          }
        })
        .catch((err) => logger.error('Cannot render legend item: ', err));
    };

    render();
    IconProcessor.get().addEventListener(render);
    return () => IconProcessor.get().removeEventListener(render);
  }, [element.geometryType, element.style, ratio]);

  return (
    <span className={Cls.container} {...attributes}>
      <canvas ref={canvasRef} width={0} height={0} className={Cls.canvas} />
      {children}
    </span>
  );
}
