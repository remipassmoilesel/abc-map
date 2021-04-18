import { SimplePropertiesMap } from '../geo/features/FeatureWrapper';

export enum ModalEventType {
  ShowRename = 'ShowRename',
  RenameClosed = 'RenameClosed',
  ShowPassword = 'ShowPassword',
  PasswordClosed = 'PasswordClosed',
  ShowFeatureProperties = 'ShowFeatureProperties',
  FeaturePropertiesClosed = 'FeaturePropertiesClosed',
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

export declare type ModalEvent =
  | ShowRenameModalEvent
  | RenameModalClosedEvent
  | ShowPasswordModalEvent
  | PasswordModalClosedEvent
  | ShowFeaturePropertiesEvent
  | FeaturePropertiesClosedEvent;

export class InternalEvent extends Event {
  constructor(type: ModalEventType, public readonly payload: ModalEvent) {
    super(type);
  }
}

export declare type ModalEventListener = (ev: ModalEvent) => void;
