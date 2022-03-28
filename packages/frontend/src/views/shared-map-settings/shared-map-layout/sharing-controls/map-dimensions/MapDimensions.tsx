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

import Cls from './MapDimensions.module.scss';
import React, { ChangeEvent, useCallback } from 'react';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import clsx from 'clsx';
import { Switch } from '../../../../../components/switch/Switch';

const t = prefixedTranslation('SharedMapSettingsView:');

interface Props {
  width: number;
  height: number;
  fullscreen: boolean;
  onChange: (width: number, height: number) => void;
  onToggleFullscreen: () => void;
}

export function MapDimensions(props: Props) {
  const { width, height, fullscreen, onChange, onToggleFullscreen } = props;

  const handleWidthChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(ev.target.value);
      onChange(value, height);
    },
    [onChange, height]
  );

  const handleHeightChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(ev.target.value);
      onChange(width, value);
    },
    [onChange, width]
  );

  return (
    <div className={clsx(Cls.dimensions, 'control-block')}>
      <div className={'mb-2'}>{t('Map_size')}</div>

      {/* Width */}
      <div className={'control-item d-flex align-items-center justify-content-between'}>
        <div className={'ml-3'}>{t('Width')}</div>
        <input type={'number'} value={width} onChange={handleWidthChange} className={'form-control'} disabled={fullscreen} />
      </div>

      {/* Height */}
      <div className={'control-item d-flex align-items-center justify-content-between'}>
        <div className={'ml-3'}>{t('Height')}</div>
        <input type={'number'} value={height} onChange={handleHeightChange} className={'form-control'} disabled={fullscreen} />
      </div>

      {/* Toggle fullscreen */}
      <div className={'control-item d-flex justify-content-end align-items-center p-2'}>
        {t('Full_page')}
        <Switch value={fullscreen} onChange={onToggleFullscreen} className={'ml-3'} />
      </div>
    </div>
  );
}
