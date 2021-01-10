export enum ModalEventType {
  ShowRename = 'ShowRename',
  RenameClosed = 'RenameClosed',
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

export declare type ModalEvent = ShowRenameModalEvent | RenameModalClosedEvent;

export class InternalEvent extends Event {
  constructor(type: ModalEventType, public readonly payload: ModalEvent) {
    super(type);
  }
}

export declare type ModalEventListener = (ev: ModalEvent) => void;
