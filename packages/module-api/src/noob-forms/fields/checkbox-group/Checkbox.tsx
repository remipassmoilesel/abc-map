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

import Cls from './Checkbox.module.scss';
import { CheckboxGroupDefinition, CheckboxOption } from '../../types';
import * as React from 'react';
import { useCallback } from 'react';
import { useNoobFormContext } from '../../NoobFormContext';
import { FieldValues } from 'react-hook-form';

interface Props {
  field: CheckboxGroupDefinition<FieldValues>;
  option: CheckboxOption;
}

export function Checkbox(props: Props) {
  const { field, option } = props;
  const { register, setValue, getValues } = useNoobFormContext();

  const handleClick = useCallback(() => {
    let values: string[] = getValues(field.name) || [];
    const remove = values.find((v) => v === option.value);
    if (remove) {
      values = values.filter((v) => v !== option.value);
    } else {
      values.push(option.value);
    }

    setValue(field.name, values);
  }, [field.name, getValues, option.value, setValue]);

  return (
    <div className={Cls.checkbox} onClick={handleClick}>
      <input
        type={'checkbox'}
        value={option.value}
        {...register(field.name, field.registerOptions)}
        className="form-check-input"
        data-testid={`${field.name}-${option.value}`}
      />
      {option.label}
    </div>
  );
}
