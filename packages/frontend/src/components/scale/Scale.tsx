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

import Cls from './Scale.module.scss';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { getPointResolution } from 'ol/proj';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('Scale:');

interface Props {
  map: MapWrapper;
  // Minimum size of scale line in pixels
  minWidth?: number;
  dpi?: number;
  className?: string;
  ratio?: number;
  // Change font size of indications. On main map there are bigger than in exports.
  baseFontSizeEm?: number;
  tooltip?: boolean;
  readOnly?: boolean;
}

const defaultBaseFontSizeEm = 1.2;

/**
 * This component show a line representing the current scale of map specified in props.
 *
 * It is used both for interactive map and for static exports.
 *
 * @param props
 * @constructor
 */
export function Scale(props: Props) {
  const { map, minWidth: _minWidth, className, baseFontSizeEm = defaultBaseFontSizeEm, ratio = 1, tooltip = true } = props;
  const minWidth = _minWidth ?? 60 * ratio;
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(minWidth);
  const [value, setValue] = useState('');

  const containerStyle: CSSProperties = useMemo(() => ({ fontSize: `${baseFontSizeEm * ratio}em` }), [baseFontSizeEm, ratio]);

  useEffect(() => {
    // This code was shamelessly borrowed from Openlayers ScaleLine, see: openlayers/src/ol/control/ScaleLine.js
    const handleViewChange = () => {
      const view = map.getView();
      const { center, resolution } = view;
      const projection = view.projection.name;

      let pointResolution = getPointResolution(projection, resolution, center, 'm');
      const nominalCount = minWidth * pointResolution;
      let readableUnit = '';

      // We adapt unit
      if (nominalCount < 0.001) {
        readableUnit = 'μm';
        pointResolution *= 1000000;
      } else if (nominalCount < 1) {
        readableUnit = 'mm';
        pointResolution *= 1000;
      } else if (nominalCount < 1000) {
        readableUnit = 'm';
      } else {
        readableUnit = 'km';
        pointResolution /= 1000;
      }

      // We find a value satisfying minwidth and begining by 1 2 or 5 (100km, 200km, 500km)
      const leadingDigits = [1, 2, 5];
      let i = 3 * Math.floor(Math.log(minWidth * pointResolution) / Math.log(10));
      let count = 0;
      let width = 0;
      let decimalCount = 0;
      while (!width || width < minWidth) {
        decimalCount = Math.floor(i / 3);
        const decimal = Math.pow(10, decimalCount);
        count = leadingDigits[((i % 3) + 3) % 3] * decimal;
        width = Math.round(count / pointResolution);

        if (isNaN(width)) {
          setVisible(false);
          return;
        }

        i++;
      }

      // Then we display result
      const label = count.toFixed(decimalCount < 0 ? -decimalCount : 0) + ' ' + readableUnit;
      setWidth(width);
      setValue(label);
      setVisible(true);
    };

    // First setup
    handleViewChange();

    map.addViewMoveListener(handleViewChange);
    return () => map.removeViewMoveListener(handleViewChange);
  }, [minWidth, map]);

  const scale = (
    <div style={containerStyle}>
      <div className={clsx(Cls.scale, className)}>
        <div>0</div>
        <div className={Cls.line} style={{ width }} />
        <div>{value}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* With tooltip */}
      {visible && tooltip && (
        <WithTooltip title={t('Scale')} placement={'top'}>
          {scale}
        </WithTooltip>
      )}

      {/* Without tooltip */}
      {visible && !tooltip && scale}
    </>
  );
}
