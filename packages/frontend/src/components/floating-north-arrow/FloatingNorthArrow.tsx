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

import Cls from './FloatingNorthArrow.module.scss';
import { Rnd, RndDragCallback } from 'react-rnd';
import React, { useCallback, useEffect, useState } from 'react';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { AbcNorth } from '@abc-map/shared';
import clsx from 'clsx';
import { NorthArrow } from '../north-arrow/NorthArrow';

interface Props {
  map: MapWrapper;
  north: AbcNorth;
  ratio?: number;
  readOnly?: boolean;
  onChange?: (before: AbcNorth) => void;
}

export function FloatingNorthArrow(props: Props) {
  const { map, north, readOnly, onChange, ratio = 1 } = props;
  const [rotation, setRotation] = useState(0);
  const size = `${ratio * 3}em`;

  const handleDragStop: RndDragCallback = useCallback(
    (ev, data) => {
      onChange && onChange({ ...north, x: data.x, y: data.y });
    },
    [onChange, north]
  );

  useEffect(() => {
    const handleViewChange = () => setRotation(map.getRotation());

    // We trigger a manual update on mount
    handleViewChange();

    // We listen for user changes
    map.unwrap().on('pointerdrag', handleViewChange);
    map.unwrap().on('moveend', handleViewChange);
    return () => {
      map.unwrap().un('pointerdrag', handleViewChange);
      map.unwrap().un('moveend', handleViewChange);
    };
  }, [map]);

  return (
    <Rnd position={{ x: north.x, y: north.y }} disableDragging={readOnly} onDragStop={handleDragStop} enableResizing={false} bounds={'parent'}>
      <NorthArrow rotation={rotation} size={size} className={clsx(Cls.northArrow, readOnly && Cls.readOnly)} />
    </Rnd>
  );
}
