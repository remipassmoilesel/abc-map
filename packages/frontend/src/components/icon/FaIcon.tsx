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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { CSSProperties } from 'react';
import Cls from './Icon.module.scss';

interface Props {
  icon: IconDefinition;
  style?: CSSProperties;
  className?: string;
  size?: string;
  color?: string;
  title?: string;
}

export function FaIcon(props: Props) {
  const { icon, size, color, title } = props;
  const className = `abc-icon ${Cls.icon} ${props.className || ''}`;
  const dimensions = (props.size && { width: size, height: size }) || undefined;
  const style: CSSProperties = { ...props.style, color, ...dimensions };

  return <FontAwesomeIcon icon={icon} style={style} className={className} title={title} />;
}
