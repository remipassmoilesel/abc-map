/**
 * Copyright © 2026 Rémi Pace.
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

import type { ChangeEvent } from 'react';
import React, { useCallback } from 'react';
import { MapActions } from '../../../../../store/map/actions';
import OptionRow from '../option-row/OptionRow';
import { useTranslation, withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { useDebouncedStyleTransform } from '../../../../../core/geo/useDebouncedStyleTransform';
import Cls from './StrokeWidthSelector.module.scss';

function StrokeWidthSelector() {
  const { t } = useTranslation('MapView');
  const strokeWidth = useAppSelector((st) => st.map.currentStyle.stroke.width);
  const dispatch = useAppDispatch();

  const styleTransform = useDebouncedStyleTransform();

  const handleSelection = useCallback(
    (ev: ChangeEvent<HTMLInputElement>): void => {
      const width = Number(ev.target.value);
      dispatch(MapActions.setStrokeWidth(width));

      styleTransform((style) => ({ ...style, stroke: { ...style.stroke, width } }));
    },
    [dispatch, styleTransform],
  );

  return (
    <OptionRow>
      <div className={'mr-2'}>{t('Thickness')}:</div>
      <input type={'number'} min={'3'} max={'20'} value={strokeWidth} onChange={handleSelection} className={`form-control form-control-sm ${Cls.input}`} />
    </OptionRow>
  );
}

export default withTranslation()(StrokeWidthSelector);
