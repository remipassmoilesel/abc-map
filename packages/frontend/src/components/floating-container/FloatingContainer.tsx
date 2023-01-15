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

import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

interface Props {
  children: ReactNode | ReactNode[];
  position: Position;
  size?: Size;
  dragging?: boolean;
  resizing?: boolean;
  onDrag?: FloatingCtrDragCallback;
  onResize?: FloatingCtrResizeCallback;
  minWidth?: number;
  minHeight?: number;
  bounds?: string;
  'data-cy'?: string;
}

export type FloatingCtrDragCallback = (x: number, y: number) => void;
export type FloatingCtrResizeCallback = (x: number, y: number, width: number, height: number) => void;
export type Position = { x: number; y: number };
export type Size = { width: number; height: number };

/**
 * Here we use a derived state because user can modify position and size of container, so we need
 * to keep the "draft" properties of element.
 * @param props
 * @constructor
 */
export function FloatingContainer(props: Props) {
  const { children, position: positionInput, size: sizeInput, onDrag, onResize, minWidth, minHeight, bounds, 'data-cy': dataCy } = props;
  const dragging = props.dragging ?? true;
  const resizing = props.resizing ?? true;

  const [x, setX] = useState(positionInput.x);
  const [y, setY] = useState(positionInput.y);
  const [width, setWidth] = useState(sizeInput?.width);
  const [height, setHeight] = useState(sizeInput?.height);

  useEffect(() => {
    setX(positionInput.x);
  }, [positionInput.x]);

  useEffect(() => {
    setY(positionInput.y);
  }, [positionInput.y]);

  useEffect(() => {
    setWidth(sizeInput?.width);
  }, [sizeInput?.width]);

  useEffect(() => {
    setHeight(sizeInput?.height);
  }, [sizeInput?.height]);

  const handleDragStop: RndDragCallback = useCallback(
    (ev, data) => {
      setX(data.x);
      setY(data.y);
      onDrag && onDrag(data.x, data.y);
    },
    [onDrag]
  );

  const handleResizeStop: RndResizeCallback = useCallback(
    (event, direction, ref, delta, position) => {
      setX(position.x);
      setY(position.y);
      setWidth(ref.clientWidth);
      setHeight(ref.clientHeight);

      onResize && onResize(position.x, position.y, ref.clientWidth, ref.clientHeight);
    },
    [onResize]
  );

  const size = typeof width !== 'undefined' && typeof height !== 'undefined' ? { width, height } : undefined;

  return (
    <Rnd
      position={{ x, y }}
      size={size}
      disableDragging={!dragging}
      enableResizing={resizing}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds={bounds ?? 'parent'}
      data-cy={dataCy}
    >
      {children}
    </Rnd>
  );
}
