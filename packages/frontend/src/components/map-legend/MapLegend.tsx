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

import { useEffect, useRef } from 'react';
import { Control } from 'ol/control';
import { LegendRenderer } from '../../core/project/rendering/LegendRenderer';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { AbcLegend, Logger } from '@abc-map/shared';

const logger = Logger.get('MapLegend.tsx');

interface Props {
  map: MapWrapper;
  legend: AbcLegend;
  ratio?: number;
}

const legendRenderer = new LegendRenderer();

export function MapLegend(props: Props) {
  const { map, legend, ratio: _ratio } = props;
  const ratio = _ratio ?? 1;
  const canvasRef = useRef<HTMLCanvasElement>();
  const controlRef = useRef<Control>();

  // Update legend when active view change
  useEffect(() => {
    if (!canvasRef.current || !controlRef.current) {
      canvasRef.current = document.createElement('canvas');
      controlRef.current = new Control({ element: canvasRef.current });
      map.unwrap().addControl(controlRef.current);
    }

    const canvas = canvasRef.current;
    const control = controlRef.current;

    const renderLegend = async () => {
      legendRenderer.setDomPosition(legend, canvas, ratio);
      await legendRenderer.renderLegend(legend, canvas, ratio);
    };

    renderLegend().catch((err) => logger.error('Cannot render legend: ', err));

    return () => {
      map.unwrap().removeControl(control);
      control.dispose();
      canvasRef.current = undefined;
      controlRef.current = undefined;
    };
  }, [legend, map, ratio]);

  return <></>;
}
