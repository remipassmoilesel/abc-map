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

import Cls from './Switch.module.scss';
import React, { useCallback, SyntheticEvent } from 'react';
import clsx from 'clsx';

interface Props {
  onChange: (ev: SyntheticEvent) => void;
  value: boolean;
  className?: string;
  disabled?: boolean;
}

export function Switch(props: Props) {
  const { value, onChange, className, disabled = false } = props;

  const toggle = useCallback(
    (ev: SyntheticEvent) => {
      if (!disabled) {
        onChange(ev);
      }
    },
    [disabled, onChange]
  );

  return (
    <div className={clsx(Cls.toggle, className, disabled && Cls.disabled)} onClick={toggle}>
      <input type="checkbox" checked={value} onChange={toggle} className={Cls.toggleCheckbox} disabled={disabled} />
      <div className={clsx(Cls.toggleSwitch, disabled && Cls.disabled)} />
    </div>
  );
}
