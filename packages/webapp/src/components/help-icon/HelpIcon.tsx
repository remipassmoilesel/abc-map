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

import React from 'react';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import Cls from './HelpIcon.module.scss';
import clsx from 'clsx';

interface Props {
  label?: string;
  className?: string;
  size?: string;
  onClick?: () => void;
}

export function HelpIcon(props: Props) {
  const { label, className, size = '1.2rem', onClick } = props;

  return (
    <div onClick={onClick} className={clsx(Cls.icon, className)}>
      {label && <div className={'mr-2'}>{label}</div>}
      <FaIcon icon={IconDefs.faQuestionCircle} size={size} className={Cls.inner} />
    </div>
  );
}
