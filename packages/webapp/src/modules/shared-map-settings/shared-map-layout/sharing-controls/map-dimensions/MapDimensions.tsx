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

import Cls from './MapDimensions.module.scss';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Switch } from '../../../../../components/switch/Switch';
import { getViewportDimensions } from '../../../../../core/ui/getViewportDimensions';
import { SmallAdvice } from '../../../../../components/small-advice/SmallAdvice';
import { useTranslation } from 'react-i18next';

interface Props {
  width: number;
  height: number;
  fullscreen: boolean;
  onChange: (width: number, height: number) => void;
  onToggleFullscreen: () => void;
}

export function MapDimensions(props: Props) {
  const { width, height, fullscreen, onChange, onToggleFullscreen } = props;
  const { t } = useTranslation('SharedMapSettingsModule');
  const maxDimensions = useMemo(() => getViewportDimensions(), []);

  const handleWidthChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(parseInt(ev.target.value), maxDimensions?.width || 3000) || 0;
      onChange(value, height);
    },
    [maxDimensions?.width, onChange, height]
  );

  const handleHeightChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(parseInt(ev.target.value), maxDimensions?.height || 3000) || 0;
      onChange(width, value);
    },
    [maxDimensions?.height, onChange, width]
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

      <div className={'control-item'}>
        <SmallAdvice label={t('About_map_size')} advice={t('If_map_size_is_bigger_than_actual_window')} placement={'right'} />
      </div>
    </div>
  );
}
