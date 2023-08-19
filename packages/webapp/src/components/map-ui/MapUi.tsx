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

import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { AbcView, Logger } from '@abc-map/shared';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { DimensionsPx } from '../../core/utils/DimensionsPx';
import { MapSizeChangedEvent } from '../../core/geo/map/MapWrapper.events';

const logger = Logger.get('MapUi.tsx');

interface Props {
  // The internal map that contains data to display
  map: MapWrapper;
  view?: AbcView;
  onViewMove?: (v: AbcView) => void;
  onSizeChange?: (d: DimensionsPx) => void;
  width?: string;
  height?: string;
  'data-cy'?: string;
  'data-testid'?: string;
  className?: string;
}

/**
 * This component display a map.
 *
 * It allows to display a map without having to manipulate refs.
 *
 * @param props
 * @constructor
 */
export function MapUi(props: Props) {
  const { map, view, width, height, onViewMove, onSizeChange, 'data-cy': dataCy, 'data-testid': dateTestId, className } = props;
  const supportRef = useRef<HTMLDivElement>(null);
  const style = useMemo(() => ({ width, height }), [height, width]);

  const handleViewMove = useCallback(() => onViewMove && onViewMove(map.getView()), [map, onViewMove]);
  const handleSizeChange = useCallback((ev: MapSizeChangedEvent) => onSizeChange && onSizeChange(ev.dimensions), [onSizeChange]);

  // Setup map target
  // We must use a dedicated effect
  useEffect(() => {
    if (!supportRef.current) {
      logger.debug('Cannot setup map, not ready');
      return;
    }

    map.setTarget(supportRef.current);
    // Starting with OL7, sometimes maps are not rendered immediatly
    map.render().catch((err) => logger.error('Rendering error: ', err));
    return () => map.setTarget(undefined);
  }, [map]);

  // Setup listeners
  useEffect(() => {
    map.addViewMoveListener(handleViewMove);
    map.addSizeListener(handleSizeChange);

    return () => {
      map.removeViewMoveListener(handleViewMove);
      map.removeSizeListener(handleSizeChange);
    };
  }, [handleSizeChange, handleViewMove, map]);

  // Set view
  useEffect(() => {
    if (view) {
      map.setView(view);
    }
  }, [map, view]);

  return <div ref={supportRef} style={style} className={className} data-cy={dataCy} data-testid={dateTestId} />;
}
