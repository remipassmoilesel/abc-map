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

import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cls from './TopBarLink.module.scss';
import clsx from 'clsx';
import { useServices } from '../../../core/useServices.ts';

export interface Props {
  to: string;
  children: ReactNode | ReactNode[];
  display?: 'vertical' | 'horizontal';
  activeMatch?: RegExp;
  'data-cy'?: string;
  className?: string;
  onClick?: () => void;
}

export function TopBarLink(props: Props) {
  const { to, children, activeMatch, display, 'data-cy': dataCy, className, onClick } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { toasts } = useServices();

  const match = activeMatch || new RegExp(`^${to}`, 'i');
  const isActive = !!location.pathname.match(match);

  const handleClick = useCallback(() => {
    navigate(to)?.catch((err) => toasts.genericError(err));
    if (onClick) {
      onClick();
    }
  }, [navigate, onClick, to, toasts]);
  const displayClass = display === 'horizontal' ? Cls.horizontal : Cls.vertical;
  return (
    <button onClick={handleClick} className={clsx(Cls.topBarLink, displayClass, isActive && Cls.active, className)} data-cy={dataCy}>
      {children}
    </button>
  );
}
