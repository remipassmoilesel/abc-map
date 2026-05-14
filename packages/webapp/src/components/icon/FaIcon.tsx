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

import Cls from './Icon.module.scss';
import type { CSSVariables } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';

interface Props {
  icon: IconDefinition;
  className?: string;
  size?: string;
  color?: string;
  title?: string;
}

export function FaIcon(props: Props) {
  const { icon, size, color, title, className } = props;
  const style: CSSProperties & CSSVariables = useMemo(() => ({ color, width: size, height: size }), [color, size]);

  return <FontAwesomeIcon icon={icon} style={style} className={clsx(`abc-icon`, Cls.icon, className)} aria-label={title} />;
}
