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

import Cls from './MapSymbolElement.module.scss';
import { RenderElementProps } from 'slate-react';
import { MapSymbolRenderer } from '../../../../core/project/rendering/MapSymbolRenderer';
import { useEditor } from '../../useEditor';
import { useEffect, useRef } from 'react';
import { MapSymbolElement as MapSymbolElementDef, Logger } from '@abc-map/shared';
import { StyleFactory } from '../../../../core/geo/styles/StyleFactory';

const logger = Logger.get('LegendItemElement.tsx');

type Props = RenderElementProps & { element: MapSymbolElementDef };

const renderer = new MapSymbolRenderer();
const styleFactory = StyleFactory.get();

export function MapSymbolElement(props: Props) {
  const { attributes, children, element } = props;
  const { ratio } = useEditor();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const style = styleFactory.getForProperties(element.style, element.geometryType, {
      ratio,
      withSelection: false,
    });

    const dimensions = renderer.symbolSizeForStyle(style, element.geometryType, ratio);
    canvas.current.width = dimensions.width;
    canvas.current.height = dimensions.height;

    renderer.renderSymbol(style, element.geometryType, canvas.current, ratio).catch((err) => logger.error('Cannot render legend item: ', err));
  }, [element.geometryType, element.style, ratio]);

  return (
    <span className={Cls.container} {...attributes}>
      <canvas ref={canvas} width={0} height={0} className={Cls.canvas} />
      {children}
    </span>
  );
}
