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

import * as React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useContext } from 'react';

/**
 * We keep our own context for further future custom tools
 */
export type FormContextContent = UseFormReturn<FieldValues>;

export const NoobFormContext = React.createContext<FormContextContent | false>(false);

export function useNoobFormContext(): FormContextContent {
  const ctx = useContext(NoobFormContext);
  if (!ctx) {
    throw new Error(`You should not use useFormContext() outside a <FormContext.Provider>`);
  }

  return ctx;
}
