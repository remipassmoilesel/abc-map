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

import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import React, { useCallback } from 'react';
import { prefixedTranslation } from '../../i18n/i18n';
import { AbcScale } from '@abc-map/shared';

const t = prefixedTranslation('ScaleControls:');

interface Props {
  disabled: boolean;
  hasScale: boolean;
  onAddScale: (scale: AbcScale) => void;
  onRemoveScale: () => void;
}

export function ScaleControls(props: Props) {
  const { hasScale, disabled, onAddScale, onRemoveScale } = props;

  const handleToggleScale = useCallback(() => {
    if (hasScale) {
      onRemoveScale();
    } else {
      onAddScale({ x: 30, y: 30 });
    }
  }, [hasScale, onAddScale, onRemoveScale]);

  return (
    <div className={'control-block'}>
      <div className={'control-item'}>
        <button onClick={handleToggleScale} disabled={disabled} className={'btn btn-link'}>
          <FaIcon icon={IconDefs.faRulerHorizontal} className={'mr-2'} />
          {hasScale ? t('Remove_scale') : t('Add_scale')}
        </button>
      </div>
    </div>
  );
}
