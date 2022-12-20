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

import Cls from './PointSizeSelector.module.scss';
import React, { ChangeEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { MapActions } from '../../../../../core/store/map/actions';
import OptionRow from '../../_common/option-row/OptionRow';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../core/store/hooks';
import { useDebouncedStyleTransform } from '../../../../../core/geo/useDebouncedStyleTransform';

export default function PointSizeSelector() {
  const size = useAppSelector((st) => st.map.currentStyle.point.size);
  const dispatch = useDispatch();
  const { t } = useTranslation('MapView', { keyPrefix: 'ToolSelector' });

  const styleTransform = useDebouncedStyleTransform();

  const handleSizeChanged = useCallback(
    (ev: ChangeEvent<HTMLInputElement>): void => {
      const size = Number(ev.target.value);
      dispatch(MapActions.setPointSize(size));

      styleTransform((style) => ({
        ...style,
        point: { ...style.point, size },
      }));
    },
    [dispatch, styleTransform]
  );

  return (
    <OptionRow>
      <div>{t('Size')}:</div>
      <input type={'number'} value={size} min={'3'} max={'200'} onChange={handleSizeChanged} className={`form-control form-control-sm ${Cls.input}`} />
    </OptionRow>
  );
}
