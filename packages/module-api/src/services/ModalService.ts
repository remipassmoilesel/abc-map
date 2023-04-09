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

import { I18nText } from '../utils/I18nText';

export enum ModalStatus {
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
}

export interface SimplePromptClosed {
  status: ModalStatus;
  value: string;
}

export interface CreatePasswordModalClosedEvent {
  status: ModalStatus;
  value: string;
}

export interface PasswordInputClosedEvent {
  status: ModalStatus;
  value: string;
}

export interface LoginClosedEvent {
  status: ModalStatus;
}

export enum OperationStatus {
  Succeed = 'Succeed',
  Interrupted = 'Interrupted',
}

export interface PromptDefinition {
  name: string;
  type: 'string' | 'number';
  description: I18nText[];
}

export type VariableMap = { [k: string]: string | number | undefined };

export interface PromptVariablesClosed {
  status: ModalStatus;
  variables: VariableMap;
}

export interface ModalService {
  prompt(title: string, message: string, value: string, validationRegexp: RegExp, validationErrorMessage: string): Promise<SimplePromptClosed>;
  confirmation(title: string, message: string): Promise<ModalStatus>;
  createPassword(title: string, message: string): Promise<CreatePasswordModalClosedEvent>;
  promptPassword(title: string, message: string, witness: string): Promise<PasswordInputClosedEvent>;
  login(): Promise<LoginClosedEvent>;
  longOperationModal<Result = void>(operation: () => Promise<OperationStatus | [OperationStatus, Result]>): Promise<OperationStatus | Result>;
  modificationsLostConfirmation(): Promise<ModalStatus>;
  dataSizeWarning(): Promise<ModalStatus>;
  promptVariables(title: string, message: string, definitions: PromptDefinition[]): Promise<PromptVariablesClosed>;
}
