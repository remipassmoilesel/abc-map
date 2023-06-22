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

import Cls from './InteractiveAttributions.module.scss';
import React from 'react';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import clsx from 'clsx';
import { AttributionFormat } from '../../core/geo/AttributionFormat';

interface Props {
  map: MapWrapper;
  className?: string;
}

/**
 * This component shows attributions for interactive maps.
 *
 * According to OpenStreetMap requirements, attributions must be visible without interactions.
 *
 * @constructor
 */
export function InteractiveAttributions(props: Props) {
  const { map, className } = props;
  const attributions = map.getAttributions(AttributionFormat.HTML);

  return (
    <div className={clsx(Cls.attributions, className)}>
      {attributions.map((attr) => (
        <div key={attr} className={Cls.attribution} dangerouslySetInnerHTML={{ __html: attr }} />
      ))}
    </div>
  );
}
