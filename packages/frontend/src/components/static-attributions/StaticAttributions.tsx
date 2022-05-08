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

import Cls from './StaticAttributions.module.scss';
import React, { CSSProperties, useMemo } from 'react';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { Logger } from '@abc-map/shared';
import MainIcon from '../../assets/main-icon.png';
import { AttributionFormat } from '../../core/geo/AttributionFormat';

const logger = Logger.get('Attributions.tsx');

interface Props {
  map: MapWrapper;
  ratio?: number;
}

const baseFontSizeEm = 0.9;

/**
 * This component displays attributions for static exports.
 *
 * @param props
 * @constructor
 */
export function StaticAttributions(props: Props) {
  const { map, ratio: _ratio } = props;
  const ratio = _ratio ?? 1;
  const attributions = map.getAttributions(AttributionFormat.Text);
  const style: CSSProperties = useMemo(() => ({ fontSize: `${baseFontSizeEm * ratio}em` }), [ratio]);

  return (
    <div className={Cls.attributions} style={style}>
      {/* We use a sub-level in order to use 'em' units in a consistent way */}
      <div className={Cls.content}>
        {attributions.map((attr) => (
          <div key={attr} className={Cls.attribution}>
            {attr}
          </div>
        ))}
        <div className={Cls.softwareBrand}>
          Abc-Map
          <img src={MainIcon} alt={MainIcon} />
        </div>
      </div>
    </div>
  );
}
