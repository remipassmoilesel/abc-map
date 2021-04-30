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

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { AbcLayout } from '@abc-map/shared-entities';
import Cls from './LayoutList.module.scss';
import LayoutListItem from './LayoutListItem';

const logger = Logger.get('LayoutList.tsx', 'warn');

interface Props {
  active?: AbcLayout;
  layouts: AbcLayout[];
  onSelected: (lay: AbcLayout) => void;
  onDeleted: (lay: AbcLayout) => void;
}

class LayoutList extends Component<Props, {}> {
  public render(): ReactNode {
    const handleSelected = this.props.onSelected;
    const handleDeleted = this.props.onDeleted;
    const items = this.props.layouts.map((lay) => {
      const active = this.props.active?.id === lay.id;
      return <LayoutListItem key={lay.id} active={active} layout={lay} onSelected={handleSelected} onDeleted={handleDeleted} />;
    });

    let message: ReactNode | undefined;
    if (!items.length) {
      message = 'Les pages sont affichées ici.';
    }

    return (
      <div className={Cls.layoutList} data-cy={'layout-list'}>
        <div className={'m-4 font-weight-bold'}>Pages</div>
        {items}
        {message && (
          <div className={'m-4'} data-cy={'no-layout'}>
            {message}
          </div>
        )}
      </div>
    );
  }
}

export default LayoutList;
