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

import React, { useCallback } from 'react';
import { AbcLegend } from '@abc-map/shared';

interface Props {
  label: string;
  legend: AbcLegend;
  disabled?: boolean;
  onClick: (legend: AbcLegend) => void;
}

export function CloneLegendButton(props: Props) {
  const { onClick, legend, label, disabled } = props;

  const handleClick = useCallback(() => onClick(legend), [legend, onClick]);

  return (
    <button onClick={handleClick} disabled={disabled} className={'btn btn-link'}>
      {label} ({legend.items.length} élements, {legend.width} x {legend.height})
    </button>
  );
}
