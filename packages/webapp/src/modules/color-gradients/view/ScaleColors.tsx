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

import React, { useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { ColorPickerButton } from '../../../components/color-picker/ColorPickerButton';
import FormLine from '../../../components/form-line/FormLine';
import { useTranslation } from 'react-i18next';

const logger = Logger.get('ScaleColors.tsx');

interface Props {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}

export function ScaleColors(props: Props) {
  const { start, end } = props;
  const { t } = useTranslation('ColorGradientsModule');

  const handleStartChanged = useCallback(
    (value: string) => {
      props.onChange(value, props.end);
    },
    [props],
  );

  const handleEndChanged = useCallback(
    (value: string) => {
      props.onChange(props.start, value);
    },
    [props],
  );

  return (
    <>
      <FormLine>
        <div className={'flex-grow-1'}>{t('Start_color')}:</div>
        <ColorPickerButton value={start} onClose={handleStartChanged} />
      </FormLine>

      <FormLine>
        <div className={'flex-grow-1'}>{t('End_color')}:</div>
        <ColorPickerButton value={end} onClose={handleEndChanged} />
      </FormLine>
    </>
  );
}
