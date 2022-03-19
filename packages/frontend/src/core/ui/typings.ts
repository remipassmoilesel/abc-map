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

import { SimplePropertiesMap } from '../geo/features/FeatureWrapper';
import { PromptDefinition } from './PromptDefinition';
import { VariableMap } from '../utils/variableExpansion';

export enum ModalEventType {
  ShowPasswordInput = 'ShowPasswordInput',
  PasswordInputClosed = 'PasswordInputClosed',
  ShowSetPassword = 'ShowSetPassword',
  SetPasswordClosed = 'SetPasswordClosed',
  ShowFeatureProperties = 'ShowFeatureProperties',
  FeaturePropertiesClosed = 'FeaturePropertiesClosed',
  ShowSolicitation = 'ShowSolicitation',
  SolicitationClosed = 'SolicitationClosed',
  ShowLogin = 'ShowLogin',
  LoginClosed = 'LoginClosed',
  ShowRegistration = 'ShowRegistration',
  RegistrationClosed = 'RegistrationClosed',
  ShowPasswordLost = 'ShowPasswordLost',
  PasswordLostClosed = 'PasswordLostClosed',
  ShowTextFeedback = 'ShowTextFeedback',
  TextFeedbackClosed = 'TextFeedbackClosed',
  ShowLongOperationModal = 'ShowLongOperationModal',
  LongOperationModalClosed = 'LongOperationModalClosed',
  ShowConfirmation = 'ShowConfirmation',
  ConfirmationClosed = 'ConfirmationClosed',
  ShowPromptVariables = 'ShowPromptVariables',
  PromptVariablesClosed = 'PromptVariablesClosed',
}

export enum ModalStatus {
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
}

export interface ShowPasswordInputModal {
  type: ModalEventType.ShowPasswordInput;
  title: string;
  message: string;
  /**
   * Witness is an encrypted string that will be used to test if password is correct.
   */
  witness: string;
}

export interface PasswordInputClosedEvent {
  type: ModalEventType.PasswordInputClosed;
  value: string;
  status: ModalStatus;
}

export interface ShowSetPasswordModal {
  type: ModalEventType.ShowSetPassword;
  title: string;
  message: string;
}

export interface SetPasswordModalClosedEvent {
  type: ModalEventType.SetPasswordClosed;
  value: string;
  status: ModalStatus;
}

export interface ShowFeaturePropertiesModal {
  type: ModalEventType.ShowFeatureProperties;
  properties: SimplePropertiesMap;
}

export interface FeaturePropertiesClosedEvent {
  type: ModalEventType.FeaturePropertiesClosed;
  status: ModalStatus;
  properties: SimplePropertiesMap;
}

export interface ShowSolicitationModal {
  type: ModalEventType.ShowSolicitation;
}

export interface SolicitationClosedEvent {
  type: ModalEventType.SolicitationClosed;
  status: ModalStatus;
}

export interface ShowLoginModal {
  type: ModalEventType.ShowLogin;
}

export interface LoginClosedEvent {
  type: ModalEventType.LoginClosed;
  status: ModalStatus;
}

export interface ShowRegistrationModal {
  type: ModalEventType.ShowRegistration;
}

export interface RegistrationClosedEvent {
  type: ModalEventType.RegistrationClosed;
  status: ModalStatus;
}

export interface ShowPasswordLostModal {
  type: ModalEventType.ShowPasswordLost;
}

export interface PasswordLostClosedEvent {
  type: ModalEventType.PasswordLostClosed;
  status: ModalStatus;
}

export interface ShowTextFeedback {
  type: ModalEventType.ShowTextFeedback;
}

export interface TextFeedbackClosed {
  type: ModalEventType.TextFeedbackClosed;
  status: ModalStatus;
}

export interface ShowLongOperationModal {
  type: ModalEventType.ShowLongOperationModal;
  processing: boolean;
}

export interface LongOperationModalClosedEvent {
  type: ModalEventType.LongOperationModalClosed;
}

export interface ShowConfirmation {
  type: ModalEventType.ShowConfirmation;
  title: string;
  message: string;
}

export interface ConfirmationClosedEvent {
  type: ModalEventType.ConfirmationClosed;
  status: ModalStatus;
}

export interface ShowPromptVariables {
  type: ModalEventType.ShowPromptVariables;
  title: string;
  message: string;
  definitions: PromptDefinition[];
}

export interface PromptVariablesClosed {
  type: ModalEventType.PromptVariablesClosed;
  status: ModalStatus;
  variables: VariableMap;
}

export declare type ModalEvent =
  | ShowPasswordInputModal
  | PasswordInputClosedEvent
  | ShowSetPasswordModal
  | SetPasswordModalClosedEvent
  | ShowFeaturePropertiesModal
  | FeaturePropertiesClosedEvent
  | ShowSolicitationModal
  | SolicitationClosedEvent
  | ShowLoginModal
  | LoginClosedEvent
  | ShowRegistrationModal
  | RegistrationClosedEvent
  | ShowPasswordLostModal
  | PasswordLostClosedEvent
  | ShowTextFeedback
  | TextFeedbackClosed
  | ShowLongOperationModal
  | LongOperationModalClosedEvent
  | ShowConfirmation
  | ConfirmationClosedEvent
  | ShowPromptVariables
  | PromptVariablesClosed;

export class InternalEvent extends Event {
  constructor(type: ModalEventType, public readonly payload: ModalEvent) {
    super(type);
  }
}

export declare type ModalEventListener<T extends ModalEvent = ModalEvent> = (ev: T) => void;

export enum OperationStatus {
  Succeed = 'Succeed',
  Interrupted = 'Interrupted',
}
