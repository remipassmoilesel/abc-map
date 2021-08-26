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
import { BaseMetadata } from '@abc-map/shared';
import Cls from './LayerListItem.module.scss';

interface Props {
  metadata: BaseMetadata;
  onClick: (id: string) => void;
}

class LayerListItem extends Component<Props, {}> {
  public render(): ReactNode {
    const meta = this.props.metadata;
    const selectedClass = meta.active ? Cls.active : '';
    const dataLayer = meta.active ? 'active' : `inactive`;
    const icon = meta.visible ? 'fa-eye' : 'fa-eye-slash';
    return (
      <div onClick={() => this.props.onClick(meta.id)} className={`${Cls.listItem} ${selectedClass}`} data-cy={'list-item'} data-layer={dataLayer}>
        <i className={`fa ${icon} mr-2`} />
        {meta.name}
      </div>
    );
  }
}

export default LayerListItem;
