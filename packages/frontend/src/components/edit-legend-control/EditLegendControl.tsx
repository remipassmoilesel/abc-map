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

import React from 'react';
import { LegendPositionSelector } from './LegendPositionSelector';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('EditLegendControl:');

interface Props {
  legendId?: string;
  onEdit: () => void;
}

export function EditLegendControl(props: Props) {
  const { legendId, onEdit } = props;
  const disabled = !legendId;

  return (
    <div className={'control-block'}>
      <div className={'mb-2'}>{t('Legend')}</div>
      <div className={'control-item'}>
        <LegendPositionSelector legendId={legendId} />
      </div>

      <div className={'control-item'}>
        <button onClick={onEdit} disabled={disabled} className={'btn btn-link'} data-cy={'edit-legend'}>
          <FaIcon icon={IconDefs.faPen} className={'mr-2'} />
          {t('Edit_legend')}
        </button>
      </div>
    </div>
  );
}
