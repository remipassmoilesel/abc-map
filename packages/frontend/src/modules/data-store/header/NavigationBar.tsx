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
import range from 'lodash/range';
import Cls from './NavigationBar.module.scss';
import clsx from 'clsx';

// This should be an odd number
const MaxButtons = 7;

interface Props {
  // This should be an odd number
  maxButtons?: number;
  offset: number;
  limit: number;
  total: number;
  onChange: (offset: number) => void;
  className?: string;
}

export function NavigationBar(props: Props) {
  const { offset, limit, total, onChange, className } = props;
  const maxButtons = props.maxButtons || MaxButtons; // Minus active page
  const activePage = Math.round(offset / limit) + 1;
  const numberOfPages = Math.round(total / limit);

  // We compute button bounds
  const halfAround = Math.round((maxButtons - 1) / 2);
  let firstButton = activePage - halfAround;
  let lastButton = activePage + halfAround;

  if (firstButton < 1) {
    firstButton = 1;
  }

  if (lastButton < maxButtons) {
    lastButton = Math.min(numberOfPages, maxButtons);
  }

  if (lastButton >= numberOfPages) {
    firstButton = Math.max(numberOfPages - maxButtons + 1, 1);
    lastButton = numberOfPages;
  }

  const handleClick = useCallback(
    (pageNbr: number) => {
      let offset = pageNbr * limit - limit;
      if (offset < 0) {
        offset = 0;
      }

      if (offset > total) {
        offset = total;
      }

      onChange(offset);
    },
    [limit, onChange, total]
  );

  return (
    <div className={clsx(Cls.navigationBar, className)}>
      {/* Go to first page */}
      <button onClick={() => handleClick(0)}>&lt;&lt;</button>

      {/* Go back */}
      <button onClick={() => handleClick(activePage - 1)}>&lt;</button>
      {range(firstButton, lastButton + 1).map((pageNbr) => {
        const isActive = pageNbr === activePage;
        const classes = isActive ? Cls.active : '';
        const testId = isActive ? 'active' : undefined;
        return (
          <button key={pageNbr} onClick={() => handleClick(pageNbr)} className={classes} data-testid={testId}>
            {pageNbr}
          </button>
        );
      })}

      {/* Go next */}
      <button onClick={() => handleClick(activePage + 1)}>&gt;</button>
    </div>
  );
}

export default NavigationBar;
