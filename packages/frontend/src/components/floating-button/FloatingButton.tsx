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

import React, { CSSProperties, MouseEvent } from 'react';
import { FaIcon } from '../icon/FaIcon';
import Cls from './FloatingButton.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { WithTooltip } from '../with-tooltip/WithTooltip';

interface Props {
  size?: string;
  icon: IconDefinition;
  title: string;
  titlePlacement?: 'top' | 'right' | 'bottom' | 'left';
  style?: CSSProperties;
  onClick: (ev: MouseEvent) => void;
  'data-cy'?: string;
}

export function FloatingButton(props: Props) {
  const { icon, size, title, titlePlacement, style, onClick, 'data-cy': dataCy } = props;

  return (
    <WithTooltip title={title} placement={titlePlacement}>
      <button onClick={onClick} style={style} className={Cls.button} data-cy={dataCy}>
        <FaIcon icon={icon} size={size || '2rem'} className={Cls.icon} />
      </button>
    </WithTooltip>
  );
}
