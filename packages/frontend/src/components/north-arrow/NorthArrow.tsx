/**
 * Copyright © 2022 Rémi Pace.
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

import Cls from './NorthArrow.module.scss';
import React, { useMemo } from 'react';
import { prefixedTranslation } from '../../i18n/i18n';
import Compass from './compass.svg';
import clsx from 'clsx';

const t = prefixedTranslation('NorthArrow:');

interface Props {
  size: string;
  // In degrees
  rotation: number;
  className?: string;
}

export function NorthArrow(props: Props) {
  const { rotation, size, className } = props;
  const style = useMemo(() => ({ transform: `rotate(${rotation}deg)`, width: size, height: size }), [rotation, size]);

  // We must disable drag in order to prevent weird behavior with FloatingNorthArrow
  return <img src={Compass} alt={t('North')} style={style} className={clsx(className, Cls.arrow)} draggable={false} />;
}
