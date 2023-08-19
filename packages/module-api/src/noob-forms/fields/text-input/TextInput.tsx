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

import Cls from '../../NoobFormBuilder.module.scss';
import { DatePickerDefinition, FieldType, NumberInputDefinition, TextInputDefinition } from '../../types';
import { FieldValues } from 'react-hook-form';
import * as React from 'react';
import { useNoobFormContext } from '../../NoobFormContext';
import { Logger } from '../../../utils';

const logger = Logger.get('TextInput.ts');

interface Props {
  definition: TextInputDefinition<FieldValues> | NumberInputDefinition<FieldValues> | DatePickerDefinition<FieldValues>;
}

export function TextInput(props: Props) {
  const { definition } = props;
  const { register } = useNoobFormContext();

  let type = '';
  switch (definition.type) {
    case FieldType.DatePicker:
      type = 'datetime-local';
      break;
    case FieldType.NumberInput:
      type = 'number';
      break;
    case FieldType.TextInput:
      type = 'text';
      break;
    default:
      logger.error('Unhandled definition: ', definition);
  }

  return (
    <div className={Cls.field}>
      <div className={Cls.label}>{definition.label}</div>

      <input type={type} {...register(definition.name, definition.registerOptions)} className={'form-control'} data-testid={definition.name} />
    </div>
  );
}
