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

import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Cls from './TopBarLink.module.scss';

export interface Props {
  to: string;
  activeMatch?: RegExp;
  label: string;
  'data-cy'?: string;
}

function TopBarLink(props: Props) {
  const location = useLocation();
  const history = useHistory();

  const dataCy = props['data-cy'];
  const to = props.to;
  const label = props.label;
  const match = props.activeMatch || new RegExp(`^${to}`, 'i');
  const isActive = !!location.pathname.match(match);
  const classes = isActive ? `${Cls.topBarLink} ${Cls.active}` : Cls.topBarLink;

  const handleClick = useCallback(() => history.push(to), [history, to]);

  return (
    <button onClick={handleClick} className={classes} data-cy={dataCy}>
      {label}
    </button>
  );
}

export default TopBarLink;
