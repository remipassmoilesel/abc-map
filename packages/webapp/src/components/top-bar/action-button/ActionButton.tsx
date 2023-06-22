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

import React, { MouseEvent, ReactNode } from 'react';
import { FaIcon } from '../../icon/FaIcon';
import clsx from 'clsx';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Cls from './ActionButton.module.scss';

interface Props {
  label: string | ReactNode;
  icon: IconDefinition;
  className?: string;
  disabled?: boolean;
  onClick: (ev: MouseEvent<HTMLButtonElement>) => void;
  'data-cy'?: string;
}

export function ActionButton(props: Props) {
  const { label, icon, className, disabled, onClick, 'data-cy': dataCy } = props;
  return (
    <button onClick={onClick} className={clsx(Cls.button, 'btn btn-link', className)} disabled={disabled} data-cy={dataCy}>
      <FaIcon icon={icon} className={'mr-3'} />
      {label}
    </button>
  );
}
