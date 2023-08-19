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
import { NominatimResult } from '../../../../core/geo/NominatimResult';
import { Logger } from '@abc-map/shared';
import Cls from './ResultItem.module.scss';
import { WithTooltip } from '../../../../components/with-tooltip/WithTooltip';

const logger = Logger.get('SearchResult.tsx');

export interface Props {
  result: NominatimResult;
  onClick: (res: NominatimResult) => void;
}

function ResultItem(props: Props) {
  const maxLen = 50;
  const { result, onClick } = props;
  const displayName = result.display_name.length > maxLen ? result.display_name.substring(0, maxLen - 3) + '...' : result.display_name;

  const handleClick = useCallback(() => onClick(result), [onClick, result]);

  return (
    <WithTooltip title={result.display_name} placement={'right'}>
      <button title={result.display_name} onClick={handleClick} className={Cls.result} data-cy={'search-result'}>
        {displayName}
      </button>
    </WithTooltip>
  );
}

export default ResultItem;
