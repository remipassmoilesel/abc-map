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

import React, { ChangeEvent, useCallback } from 'react';
import { MapActions } from '../../../../../core/store/map/actions';
import ColorPicker from '../../../../../components/color-picker/ColorPickerButton';
import OptionRow from '../option-row/OptionRow';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../core/store/hooks';
import { useServices } from '../../../../../core/useServices';
import { useDebouncedStyleTransform } from '../../../../../core/geo/useDebouncedStyleTransform';
import Cls from './TextFormat.module.scss';

const t = prefixedTranslation('MapView:');

function TextFormat() {
  const { geo } = useServices();

  const color = useAppSelector((st) => st.map.currentStyle.text.color);
  const size = useAppSelector((st) => st.map.currentStyle.text.size);
  const offsetX = useAppSelector((st) => st.map.currentStyle.text.offsetX);
  const offsetY = useAppSelector((st) => st.map.currentStyle.text.offsetY);
  const rotation = useAppSelector((st) => st.map.currentStyle.text.rotation);

  const dispatch = useAppDispatch();

  const styleTransform = useDebouncedStyleTransform();

  const handleColorSelected = useCallback(
    (color: string): void => {
      dispatch(MapActions.setTextColor(color));
      geo.updateSelectedFeatures((style) => ({ ...style, text: { ...style.text, color } }));
    },
    [dispatch, geo]
  );

  const handleSizeChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>): void => {
      const value = parseInt(ev.target.value);
      if (isNaN(value)) {
        return;
      }

      dispatch(MapActions.setTextSize(value));
      styleTransform((style) => ({ ...style, text: { ...style.text, size: value } }));
    },
    [dispatch, styleTransform]
  );

  const handleOffsetXChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(ev.target.value);
      if (isNaN(value)) {
        return;
      }

      dispatch(MapActions.setTextOffsetX(value));
      styleTransform((style) => ({ ...style, text: { ...style.text, offsetX: value } }));
    },
    [styleTransform, dispatch]
  );

  const handleOffsetYChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(ev.target.value);
      if (isNaN(value)) {
        return;
      }

      dispatch(MapActions.setTextOffsetY(value));
      styleTransform((style) => ({ ...style, text: { ...style.text, offsetY: value } }));
    },
    [styleTransform, dispatch]
  );

  const handleRotationChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(ev.target.value);
      if (isNaN(value)) {
        return;
      }

      dispatch(MapActions.setTextRotation(value));
      styleTransform((style) => ({ ...style, text: { ...style.text, rotation: value } }));
    },
    [styleTransform, dispatch]
  );

  return (
    <>
      {/* Color */}
      <OptionRow>
        <div>{t('Color')}:</div>
        <ColorPicker value={color} onClose={handleColorSelected} />
      </OptionRow>

      {/* Size */}
      <OptionRow>
        <div>{t('Size')}:</div>
        <input
          type={'number'}
          min={'5'}
          max={'100'}
          onInput={handleSizeChange}
          value={size}
          className={`form-control form-control-sm ${Cls.input}`}
          data-testid={'text-size'}
        />
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
            className={`form-control form-control-sm ${Cls.input}`}
            data-testid={'text-offsetX'}
          />

          <div className={'mx-2'}>y</div>
          <input
            type={'number'}
            value={offsetY}
            onInput={handleOffsetYChange}
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
          className={`form-control form-control-sm ${Cls.input}`}
          data-testid={'text-rotation'}
        />
      </OptionRow>
    </>
  );
}

export default withTranslation()(TextFormat);
