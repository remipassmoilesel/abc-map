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
import { WithTooltip } from '../../../../../components/with-tooltip/WithTooltip';
import Cls from './ActionButton.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FaIcon } from '../../../../../components/icon/FaIcon';

interface Props {
  onClick: () => void;
  title: string;
  icon: IconDefinition;
  'data-cy'?: string;
  'data-testid'?: string;
}

export function ActionButton(props: Props) {
  const { title, icon, onClick } = props;
  const dataCy = props['data-cy'];
  const dataTestId = props['data-testid'];

  return (
    <WithTooltip title={title} placement={'left'}>
      <button onClick={onClick} className={`btn btn-link ${Cls.button}`} data-cy={dataCy} data-testid={dataTestId}>
        <FaIcon icon={icon} size={'1.1rem'} />
      </button>
    </WithTooltip>
  );
}
