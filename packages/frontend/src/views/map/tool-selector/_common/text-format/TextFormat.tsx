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

import React, { ChangeEvent } from 'react';
import { MapActions } from '../../../../../core/store/map/actions';
import ColorPicker from '../../../../../components/color-picker/ColorPicker';
import * as _ from 'lodash';
import OptionRow from '../option-row/OptionRow';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../core/store/hooks';
import { useServices } from '../../../../../core/hooks';
import Cls from './TextFormat.module.scss';

const t = prefixedTranslation('MapView:ToolSelector.');

function TextFormat() {
  const { geo } = useServices();

  const color = useAppSelector((st) => st.map.currentStyle.text.color);
  const size = useAppSelector((st) => st.map.currentStyle.text.size);
  const offsetX = useAppSelector((st) => st.map.currentStyle.text.offsetX);
  const offsetY = useAppSelector((st) => st.map.currentStyle.text.offsetY);
  const rotation = useAppSelector((st) => st.map.currentStyle.text.rotation);

  const dispatch = useAppDispatch();

  const handleColorSelected = (color: string): void => {
    dispatch(MapActions.setTextColor(color));

    geo.updateSelectedFeatures((style) => ({
      ...style,
      text: { ...style.text, color },
    }));
  };

  const handleSizeChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    const size = parseInt(ev.target.value);
    if (isNaN(size)) {
      return;
    }

    dispatch(MapActions.setTextSize(size));

    geo.updateSelectedFeatures((style) => ({
      ...style,
      text: { ...style.text, size },
    }));
  };

  const handleOffsetXChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(ev.target.value);
    if (isNaN(value)) {
      return;
    }

    dispatch(MapActions.setTextOffsetX(value));

    geo.updateSelectedFeatures((style) => ({
      ...style,
      text: { ...style.text, offsetX: value },
    }));
  };

  const handleOffsetYChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(ev.target.value);
    if (isNaN(value)) {
      return;
    }

    dispatch(MapActions.setTextOffsetY(value));

    geo.updateSelectedFeatures((style) => ({
      ...style,
      text: { ...style.text, offsetY: value },
    }));
  };

  const handleRotationChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(ev.target.value);
    if (isNaN(value)) {
      return;
    }

    dispatch(MapActions.setTextRotation(value));

    geo.updateSelectedFeatures((style) => ({
      ...style,
      text: { ...style.text, rotation: value },
    }));
  };

  return (
    <>
      {/* Color */}
      <OptionRow>
        <div>{t('Color')}:</div>
        <ColorPicker initialValue={color} onClose={handleColorSelected} />
      </OptionRow>

      {/* Size */}
      <OptionRow>
        <div>{t('Size')}:</div>
        <select onChange={handleSizeChange} value={size} className={`form-control form-control-sm ${Cls.select}`} data-testid={'text-size'}>
          {_.range(5, 51).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </OptionRow>

      {/* Offset X and Y */}
      <div className={'d-flex flex-column'}>
        <div className={'mb-2'}>{t('Position')}:</div>
        <div className={'d-flex justify-content-end align-items-center mb-2'}>
          <div className={'mr-2'}>x</div>
          <input
            type={'number'}
            value={offsetX}
            onInput={handleOffsetXChange}
            min={0}
            className={`form-control form-control-sm ${Cls.input}`}
            data-testid={'text-offsetX'}
          />

          <div className={'mx-2'}>y</div>
          <input
            type={'number'}
            value={offsetY}
            onInput={handleOffsetYChange}
            min={0}
            className={`form-control form-control-sm ${Cls.input}`}
            data-testid={'text-offsetY'}
          />
        </div>
      </div>

      {/* Rotation */}
      <OptionRow>
        <div>{t('Rotation')}:</div>
        <input
          type={'number'}
          value={rotation}
          onInput={handleRotationChange}
          min={0}
          className={`form-control form-control-sm ${Cls.input}`}
          data-testid={'text-rotation'}
        />
      </OptionRow>
    </>
  );
}

export default withTranslation()(TextFormat);
