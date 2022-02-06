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

import { AttributionRenderer } from '../../core/project/rendering/AttributionRenderer';
import { useServices } from '../../core/useServices';
import React, { useEffect, useRef } from 'react';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { Control } from 'ol/control';
import { LegendDisplay, Logger } from '@abc-map/shared';

const logger = Logger.get('Attributions.tsx');

interface Props {
  // Attributions are on the opposite side of legend
  legendDisplay: LegendDisplay;
  map: MapWrapper;
  ratio?: number;
}

const attrRenderer = new AttributionRenderer();

export function Attributions(props: Props) {
  const { map, legendDisplay, ratio } = props;
  const { project } = useServices();
  const canvasRef = useRef<HTMLCanvasElement>();
  const controlRef = useRef<Control>();

  // Update attributions when map or legend change
  useEffect(() => {
    if (!canvasRef.current || !controlRef.current) {
      canvasRef.current = document.createElement('canvas');
      controlRef.current = new Control({ element: canvasRef.current });
      map.unwrap().addControl(controlRef.current);
    }

    const canvas = canvasRef.current;
    const control = controlRef.current;

    const render = async () => {
      attrRenderer.setDomPosition(legendDisplay, canvas);
      await attrRenderer.render(map.getTextAttributions(), canvas, ratio ?? 1);
    };

    render().catch((err) => logger.error('Cannot render attributions: ', err));

    return () => {
      map.unwrap().removeControl(control);
      control.dispose();
      canvasRef.current = undefined;
      controlRef.current = undefined;
    };
  }, [legendDisplay, map, project, ratio]);

  return <></>;
}
