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

import FormCls from '../../NoobFormBuilder.module.scss';
import Cls from './CheckboxGroup.module.scss';
import { CheckboxGroupDefinition } from '../../types';
import { FieldValues } from 'react-hook-form';
import * as React from 'react';
import { Checkbox } from './Checkbox';

interface Props {
  definition: CheckboxGroupDefinition<FieldValues>;
}

export function CheckboxGroup(props: Props) {
  const { definition } = props;

  return (
    <div className={FormCls.field}>
      <div className={FormCls.label}>{definition.label}</div>

      <div className={Cls.container}>
        {definition.options.map((opt) => (
          <Checkbox key={`${definition.name}-${opt.value}`} field={definition} option={opt} />
        ))}
      </div>
    </div>
  );
}
