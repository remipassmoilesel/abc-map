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

import { useCallback } from 'react';
import { AbcSharedView } from '@abc-map/shared';
import Cls from './ListItem.module.scss';

interface Props {
  view: AbcSharedView;
  active: boolean;
  onClick: (v: AbcSharedView) => void;
}

function ListItem(props: Props) {
  const { view, onClick, active } = props;

  const handleClick = useCallback(() => onClick(view), [onClick, view]);

  return (
    <div className={`${Cls.listItem} ${active ? Cls.active : ''}`} onClick={handleClick}>
      {view.title}
    </div>
  );
}

export default ListItem;
