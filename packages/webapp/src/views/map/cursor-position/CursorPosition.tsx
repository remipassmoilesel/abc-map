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

import React, { useEffect, useMemo, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { toPrecision } from '../../../core/utils/numbers';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { prefixedTranslation } from '../../../i18n/i18n';
import { useServices } from '../../../core/useServices';
import throttle from 'lodash/throttle';
import Cls from './CursorPosition.module.scss';

const logger = Logger.get('CursorPosition.tsx');

const t = prefixedTranslation('MapView:');

function CursorPosition() {
  const { geo } = useServices();
  const [position, setPosition] = useState<Coordinate | undefined>();

  // Set position when pointer move on map
  const handlePointerMove = useMemo(
    () =>
      throttle(
        (ev: MapBrowserEvent<MouseEvent>) => {
          const pos = toLonLat(ev.coordinate, ev.map.getView().getProjection());
          setPosition(pos);
        },
        200,
        { trailing: true }
      ),
    []
  );

  // Listen to cursor moves on map
  useEffect(() => {
    const map = geo.getMainMap();
    map.unwrap().on('pointermove', handlePointerMove);

    return () => {
      const map = geo.getMainMap();
      map.unwrap().un('pointermove', handlePointerMove);
    };
  }, [geo, handlePointerMove]);

  const lon = position && toPrecision(position[0], 3);
  const lat = position && toPrecision(position[1], 3);
  return (
    <div className={'control-block'}>
      <div className={'mb-3'}>
        <b>{t('Cursor_position')}</b>
      </div>
      <div className={Cls.latLon}>
        <div>{t('Latitude')}</div> <div>{lat ?? t('Unknown')} °</div>
      </div>
      <div className={Cls.latLon}>
        <div>{t('Longitude')}</div> <div>{lon ?? t('Unknown')} °</div>
      </div>
    </div>
  );
}

export default CursorPosition;
