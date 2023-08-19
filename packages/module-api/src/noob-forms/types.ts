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

import { FieldValues } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types';
import { MapWrapper } from '../map';

export type SubmitHandler<T extends FieldValues> = (values: T) => void;

export type Constraints<T extends FieldValues> = RegisterOptions<T>;

export type FieldDefinition<T extends FieldValues> =
  | TextInputDefinition<T>
  | NumberInputDefinition<T>
  | SelectDefinition<T>
  | CheckboxGroupDefinition<T>
  | LayerSelectorDefinition<T>
  | DatePickerDefinition<T>;

export enum FieldType {
  TextInput = 'TextInput',
  NumberInput = 'NumberInput',
  Select = 'Select',
  CheckboxGroup = 'CheckboxGroup',
  LayerSelector = 'LayerSelector',
  DatePicker = 'DatePicker',
}

export interface BaseFieldConfiguration<T extends FieldValues> {
  /**
   * Form field name. Will be the result field name too.
   * ```
   *    // For this call
   *    builder.addCheckboxes({ name: 'size' , ...}, ...)
   *
   *    // Result will be
   *    { size: ... }
   * ```
   */
  name: string;
  /**
   * Label displayed next to field
   */
  label: string;
  registerOptions?: Constraints<T>;
}

export interface TextInputDefinition<T extends FieldValues> extends BaseFieldConfiguration<T> {
  type: FieldType.TextInput;
}

export interface NumberInputDefinition<T extends FieldValues> extends BaseFieldConfiguration<T> {
  type: FieldType.NumberInput;
}

export interface SelectDefinition<T extends FieldValues> extends BaseFieldConfiguration<T> {
  type: FieldType.Select;
  options: SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface CheckboxGroupDefinition<T extends FieldValues> extends BaseFieldConfiguration<T> {
  type: FieldType.CheckboxGroup;
  options: CheckboxOption[];
}

export interface CheckboxOption {
  value: string;
  label: string;
}

export interface LayerSelectorDefinition<T extends FieldValues> extends BaseFieldConfiguration<T> {
  type: FieldType.LayerSelector;
  map: MapWrapper;
}

export interface DatePickerDefinition<T extends FieldValues> extends BaseFieldConfiguration<T> {
  type: FieldType.DatePicker;
}
