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

import React, { ReactComponentElement } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Cls from './WithTooltip.module.scss';

interface Props {
  title: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactComponentElement<any, any>;
}

/**
 * In order to use this component, children must accepts ref.
 * @param props
 * @constructor
 */
export function WithTooltip(props: Props) {
  const { children, title, placement = 'bottom' } = props;

  const overlay = (
    <Tooltip id={title} className={Cls.tooltip}>
      {title}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement={placement} overlay={overlay}>
      {children}
    </OverlayTrigger>
  );
}
