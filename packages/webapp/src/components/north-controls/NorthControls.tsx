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

import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import React, { useCallback } from 'react';
import { prefixedTranslation } from '../../i18n/i18n';
import { AbcNorth } from '@abc-map/shared';

const t = prefixedTranslation('NorthControls:');

interface Props {
  disabled: boolean;
  hasNorth: boolean;
  onAddNorth: (north: AbcNorth) => void;
  onRemoveNorth: () => void;
}

export function NorthControls(props: Props) {
  const { hasNorth, disabled, onAddNorth, onRemoveNorth } = props;

  const handleToggleNorth = useCallback(() => {
    if (hasNorth) {
      onRemoveNorth();
    } else {
      onAddNorth({ x: 30, y: 30 });
    }
  }, [hasNorth, onAddNorth, onRemoveNorth]);

  return (
    <div className={'control-block'}>
      <div className={'control-item'}>
        <button onClick={handleToggleNorth} disabled={disabled} className={'btn btn-link'}>
          <FaIcon icon={IconDefs.faCompass} className={'mr-2'} />
          {hasNorth ? t('Remove_north') : t('Add_north')}
        </button>
      </div>
    </div>
  );
}
