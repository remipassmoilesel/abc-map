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

import React, { ReactNode } from 'react';
import Classes from './FullscreenModal.module.scss';
import clsx from 'clsx';
import { AppearAnimation } from '../appear-animation/AppearAnimation';

interface Props {
  children: ReactNode;
  className?: ReactNode;
}

export function FullscreenModal(props: Props) {
  const { children, className } = props;

  return (
    <AppearAnimation>
      <div className={clsx(Classes.modal, className)}>{children}</div>
    </AppearAnimation>
  );
}
