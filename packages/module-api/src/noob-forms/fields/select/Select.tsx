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

import Cls from '../../NoobFormBuilder.module.scss';
import { SelectDefinition } from '../../types';
import { FieldValues } from 'react-hook-form';
import * as React from 'react';
import { useNoobFormContext } from '../../NoobFormContext';

interface Props {
  definition: SelectDefinition<FieldValues>;
}

export function Select(props: Props) {
  const { definition } = props;
  const { register } = useNoobFormContext();

  return (
    <div className={Cls.field}>
      <div className={Cls.label}>{definition.label}</div>

      <select {...register(definition.name, definition.registerOptions)} className={'form-select'} data-testid={definition.name}>
        {/* Empty option needed for init or undefined values */}
        <option></option>
        {definition.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
