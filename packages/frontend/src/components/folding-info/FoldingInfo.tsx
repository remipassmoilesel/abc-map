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

import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import React, { ReactNode, useCallback, useState } from 'react';
import clsx from 'clsx';

interface Props {
  title: string;
  type?: string;
  initallyOpen?: boolean;
  className?: string;
  children: ReactNode;
}

export function FoldingInfo(props: Props) {
  const { title, initallyOpen, children, className } = props;
  const type = props.type || 'info';
  const [isOpen, setOpen] = useState(initallyOpen ?? false);

  const handleClick = useCallback(() => setOpen(!isOpen), [isOpen]);

  return (
    <div className={clsx('alert alert-' + type, className)}>
      <div onClick={handleClick} className={'d-flex justify-content-between cursor-pointer'}>
        {title}
        {isOpen && <FaIcon icon={IconDefs.faChevronDown} />}
        {!isOpen && <FaIcon icon={IconDefs.faChevronRight} />}
      </div>
      {isOpen && <div className={'mt-2'}>{children}</div>}
    </div>
  );
}
