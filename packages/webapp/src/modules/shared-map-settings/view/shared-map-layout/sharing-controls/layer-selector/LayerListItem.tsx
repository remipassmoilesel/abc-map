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
import { IconDefs } from '../../../../../../components/icon/IconDefs';
import { FaIcon } from '../../../../../../components/icon/FaIcon';

interface Props {
  metadata: BaseMetadata;
  visible: boolean;
  onSelect: (metadata: BaseMetadata) => void;
}

function LayerListItem(props: Props) {
  const { metadata, visible } = props;
  const icon = visible ? IconDefs.faEye : IconDefs.faEyeSlash;
  const iconClasses = visible ? `${Cls.visibility} ${Cls.visible}` : `${Cls.visibility} ${Cls.notVisible}`;

  const handleSelect = useCallback(() => props.onSelect(metadata), [props, metadata]);

  return (
    <div onClick={handleSelect} className={Cls.listItem}>
      {/* Eye icon if layer is visible */}
      <div className={iconClasses}>
        <FaIcon icon={icon} className={iconClasses} size={'1.2rem'} />
      </div>
      {/* Name of layer */}
      <div className={'flex-grow-1'} onClick={handleSelect}>
        {metadata.name}
      </div>
    </div>
  );
}

export default LayerListItem;
