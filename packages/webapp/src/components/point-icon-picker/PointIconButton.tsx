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

import clsx from 'clsx';
import Cls from './PointIconButton.module.scss';
import React, { useCallback } from 'react';
import { IconPreview } from './IconPreview';

interface Props {
  value: IconPreview;
  selected: boolean;
  onSelected: (icon: IconPreview) => void;
  'data-cy'?: string;
}

export function PointIconButton(props: Props) {
  const { value, selected, onSelected, 'data-cy': dataCy } = props;

  const handleClick = useCallback(() => onSelected(value), [onSelected, value]);

  return (
    <button
      onClick={handleClick}
      className={clsx(`btn btn-outline-secondary`, Cls.iconPreview, selected && Cls.selected)}
      data-icon={value.icon.name}
      data-cy={dataCy}
    >
      <img src={value.preview} alt={value.icon.name} />
    </button>
  );
}
