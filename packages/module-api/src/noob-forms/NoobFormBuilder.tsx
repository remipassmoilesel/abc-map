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

import Cls from './NoobFormBuilder.module.scss';
import * as React from 'react';
import { ReactElement } from 'react';
import {
  BaseFieldConfiguration,
  CheckboxGroupDefinition,
  CheckboxOption,
  Constraints,
  DatePickerDefinition,
  FieldDefinition,
  FieldType,
  LayerSelectorDefinition,
  NumberInputDefinition,
  SelectDefinition,
  SelectOption,
  SubmitHandler,
  TextInputDefinition,
} from './types';
import { UseFormReturn, FieldValues, SubmitHandler as RHFSubmitHandler } from 'react-hook-form';
import { Subscription } from 'react-hook-form/dist/utils/createSubject';
import { TextInput } from './fields/text-input/TextInput';
import { Select } from './fields/select/Select';
import { CheckboxGroup } from './fields/checkbox-group/CheckboxGroup';
import { LayerSelector } from './fields/layer-selector/LayerSelector';
import { NoobFormContext, FormContextContent } from './NoobFormContext';
import { Logger } from '../utils/Logger';
import { MapWrapper } from '../map';
import { FieldErrors } from 'react-hook-form';

const logger = Logger.get('NoobFormBuilder.tsx');

interface CommonLabels {
  submitButton: string;
  cancelButton: string;
  formHasErrors: string;
}

export type FormErrors<T extends FieldValues> = FieldErrors<T>;
export type ErrorHandler<T extends FieldValues> = (errors: FormErrors<T>) => string[];

export class NoobFormBuilder<T extends FieldValues> {
  private fields: FieldDefinition<T>[] = [];
  private submitHandler?: SubmitHandler<T>;
  private submitDisabled?: boolean;
  private cancelHandler?: () => void;
  private errorHandler?: ErrorHandler<T>;
  private labels: CommonLabels = {
    submitButton: 'Submit',
    cancelButton: 'Cancel',
    formHasErrors: 'Form has errors',
  };

  /**
   * You should probably use useNoobFormBuilder() instead of constructor
   */
  constructor(private formContext: UseFormReturn<T>) {}

  /**
   * You can set here labels that are used in forms.
   *
   * For the moment, we cannot use translation in forms.
   *
   * @param labels
   */
  public setCommonLabels(labels: Partial<CommonLabels>): NoobFormBuilder<T> {
    this.labels = {
      ...this.labels,
      ...labels,
    };
    return this;
  }

  /**
   * Register a function that will be called each time form change
   *
   * @param handler
   */
  public onChange(handler: (values: T) => void): Subscription {
    return this.formContext.watch((values) => handler(values as T));
  }

  /**
   * Register a function that will be called each time form change
   *
   * @param handler
   */
  public onCancel(handler: () => void) {
    this.cancelHandler = handler;
    return this;
  }

  /**
   * Register a function that will be called each time user submit form
   *
   * @param handler
   */
  public onSubmit(handler: SubmitHandler<T>): NoobFormBuilder<T> {
    this.submitHandler = handler;
    return this;
  }

  public disableSubmit(value: boolean): NoobFormBuilder<T> {
    this.submitDisabled = value;
    return this;
  }

  /**
   * Register a function that will be called each time user submit form, if there is at least an error.
   *
   * @param handler
   */
  public onErrors(handler: ErrorHandler<T>): NoobFormBuilder<T> {
    this.errorHandler = handler;
    return this;
  }

  /**
   * Add a text input. See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/text
   *
   * @param config
   * @param registerOptions
   */
  public addText(config: BaseFieldConfiguration<T>, registerOptions?: Constraints<T>): NoobFormBuilder<T> {
    const field: TextInputDefinition<T> = {
      type: FieldType.TextInput,
      ...config,
      registerOptions,
    };
    this.fields.push(field);

    return this;
  }

  /**
   * Add a number input. See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
   *
   * @param config
   * @param registerOptions
   */
  public addNumber(config: BaseFieldConfiguration<T>, registerOptions?: Constraints<T>): NoobFormBuilder<T> {
    const field: NumberInputDefinition<T> = {
      type: FieldType.NumberInput,
      ...config,
      registerOptions,
    };
    this.fields.push(field);

    return this;
  }

  /**
   * Add a layer selector.
   *
   * All layers of specified map will be displayed as a possible choice.
   *
   * @param config
   * @param map
   * @param registerOptions
   */
  public addLayerSelector(config: BaseFieldConfiguration<T>, map: MapWrapper, registerOptions?: Constraints<T>): NoobFormBuilder<T> {
    const field: LayerSelectorDefinition<T> = {
      type: FieldType.LayerSelector,
      ...config,
      map,
      registerOptions,
    };
    this.fields.push(field);

    return this;
  }

  /**
   * Add a datetime input. See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
   *
   * @param config
   * @param registerOptions
   */
  public addDatePicker(config: BaseFieldConfiguration<T>, registerOptions?: Constraints<T>): NoobFormBuilder<T> {
    const field: DatePickerDefinition<T> = {
      type: FieldType.DatePicker,
      ...config,
      registerOptions,
    };
    this.fields.push(field);

    return this;
  }

  /**
   * Add a select input. See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
   *
   * @param config
   * @param options
   * @param registerOptions
   */
  public addSelect(config: BaseFieldConfiguration<T>, options: SelectOption[], registerOptions?: Constraints<T>): NoobFormBuilder<T> {
    const field: SelectDefinition<T> = {
      type: FieldType.Select,
      ...config,
      options,
      registerOptions,
    };
    this.fields.push(field);

    return this;
  }

  /**
   * Add a list of checkboxes. See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox
   *
   * @param config
   * @param options
   * @param registerOptions
   */
  public addCheckboxes(config: BaseFieldConfiguration<T>, options: CheckboxOption[], registerOptions?: Constraints<T>): NoobFormBuilder<T> {
    const field: CheckboxGroupDefinition<T> = {
      type: FieldType.CheckboxGroup,
      ...config,
      options,
      registerOptions,
    };
    this.fields.push(field);

    return this;
  }

  public build(): ReactElement {
    const {
      handleSubmit,
      formState: { errors },
    } = this.formContext;

    if (!this.submitHandler) {
      throw new Error('You must call onSubmit() before build.');
    }

    if (!this.errorHandler) {
      throw new Error('You must call onErrors() before build.');
    }

    const context: FormContextContent = this.formContext as FormContextContent;

    let errorMessages: string[] = [];
    const hasError = !!Object.keys(errors).length;
    if (hasError) {
      errorMessages = this.errorHandler(errors as any);
    }

    return (
      <NoobFormContext.Provider value={context}>
        <form onSubmit={handleSubmit(this.submitHandler as RHFSubmitHandler<T>)} onReset={this.cancelHandler} className={Cls.form}>
          {/* Form fields */}
          {this.fields.map((field) => {
            switch (field.type) {
              case FieldType.TextInput:
              case FieldType.NumberInput:
              case FieldType.DatePicker:
                return <TextInput key={field.name} definition={field as TextInputDefinition<FieldValues>} />;
              case FieldType.Select:
                return <Select key={field.name} definition={field as SelectDefinition<FieldValues>} />;
              case FieldType.CheckboxGroup:
                return <CheckboxGroup key={field.name} definition={field as CheckboxGroupDefinition<FieldValues>} />;
              case FieldType.LayerSelector:
                return <LayerSelector key={field.name} definition={field as LayerSelectorDefinition<FieldValues>} />;
              default:
                logger.error('Unsupported field: ', field);
                return null;
            }
          })}

          {/* Form errors */}
          {hasError && (
            <div className={Cls.errors}>
              <div className={Cls.title}>{this.labels.formHasErrors}</div>
              {errorMessages.map((err) => (
                <div key={err}>{err}</div>
              ))}
            </div>
          )}

          {/* Submit controls */}
          <div className={'d-flex justify-content-end'}>
            <button type={'reset'} className={'btn btn-secondary mr-3'} data-testid={'cancel-button'}>
              {this.labels.cancelButton}
            </button>

            <button type={'submit'} disabled={this.submitDisabled} className={'btn btn-primary'} data-testid={'submit-button'}>
              {this.labels.submitButton}
            </button>
          </div>
        </form>
      </NoobFormContext.Provider>
    );
  }
}
