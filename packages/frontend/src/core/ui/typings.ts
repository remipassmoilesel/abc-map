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

export enum ModalEventType {
  ShowRename = 'ShowRename',
  RenameClosed = 'RenameClosed',
  ShowPassword = 'ShowPassword',
  PasswordClosed = 'PasswordClosed',
  ShowFeatureProperties = 'ShowFeatureProperties',
  FeaturePropertiesClosed = 'FeaturePropertiesClosed',
  ShowSolicitation = 'ShowSolicitation',
  SolicitationClosed = 'SolicitationClosed',
}

export enum ModalStatus {
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
}

export interface ShowRenameModalEvent {
  type: ModalEventType.ShowRename;
  title: string;
  message: string;
  value: string;
}

export interface RenameModalClosedEvent {
  type: ModalEventType.RenameClosed;
  value: string;
  status: ModalStatus;
}

export interface ShowPasswordModalEvent {
  type: ModalEventType.ShowPassword;
  title: string;
  message: string;
}

export interface PasswordModalClosedEvent {
  type: ModalEventType.PasswordClosed;
  value: string;
  status: ModalStatus;
}

export interface ShowFeaturePropertiesEvent {
  type: ModalEventType.ShowFeatureProperties;
  properties: SimplePropertiesMap;
}

export interface FeaturePropertiesClosedEvent {
  type: ModalEventType.FeaturePropertiesClosed;
  status: ModalStatus;
  properties: SimplePropertiesMap;
}

export interface ShowSolicitationEvent {
  type: ModalEventType.ShowSolicitation;
}

export interface SolicitationClosedEvent {
  type: ModalEventType.SolicitationClosed;
  status: ModalStatus;
}

export declare type ModalEvent =
  | ShowRenameModalEvent
  | RenameModalClosedEvent
  | ShowPasswordModalEvent
  | PasswordModalClosedEvent
  | ShowFeaturePropertiesEvent
  | FeaturePropertiesClosedEvent
  | ShowSolicitationEvent
  | SolicitationClosedEvent;

export class InternalEvent extends Event {
  constructor(type: ModalEventType, public readonly payload: ModalEvent) {
    super(type);
  }
}

export declare type ModalEventListener = (ev: ModalEvent) => void;
