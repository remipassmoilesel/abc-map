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

import Cls from './MapSymbol.module.scss';
import { useCallback } from 'react';
import { WithTooltip } from '../../../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { FaIcon } from '../../../icon/FaIcon';
import { IconDefs } from '../../../icon/IconDefs';

const t = prefixedTranslation('TextEditor:');

export function MapSymbol() {
  const handleClick = useCallback(() => alert('Not implemented'), []);

  return (
    <div className={Cls.container}>
      <WithTooltip title={t('Insert_map_symbol')}>
        <button onClick={handleClick}>
          <FaIcon icon={IconDefs.faMapMarkerAlt} />
        </button>
      </WithTooltip>
    </div>
  );
}
