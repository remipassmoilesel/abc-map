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

import React, { useCallback } from 'react';
import { BaseMetadata } from '@abc-map/shared';
import Cls from './LayerListItem.module.scss';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { FaIcon } from '../../../../components/icon/FaIcon';

interface Props {
  metadata: BaseMetadata;
  onSelect: (id: string) => void;
  onToggleVisibility: (lay: string) => void;
}

function LayerListItem(props: Props) {
  const meta = props.metadata;
  const itemClasses = meta.active ? `${Cls.listItem} ${Cls.active}` : `${Cls.listItem}`;
  const icon = meta.visible ? IconDefs.faEye : IconDefs.faEyeSlash;
  const iconClasses = meta.visible ? `${Cls.visibility} ${Cls.visible}` : `${Cls.visibility} ${Cls.notVisible}`;
  const dataLayer = meta.active ? 'active' : `inactive`;

  const handleSelect = useCallback(() => {
    props.onSelect(meta.id);
  }, [props, meta]);

  const handleToggleVisibility = useCallback(() => {
    props.onToggleVisibility(meta.id);
  }, [props, meta]);

  return (
    <div className={itemClasses} data-cy={'list-item'} data-layer={dataLayer}>
      {/* Eye icon, visible only if layer is visible */}
      <div onClick={handleToggleVisibility} className={iconClasses}>
        <FaIcon icon={icon} className={iconClasses} size={'1.2rem'} />
      </div>
      <div className={'flex-grow-1'} onClick={handleSelect}>
        {meta.name}
      </div>
    </div>
  );
}

export default LayerListItem;
