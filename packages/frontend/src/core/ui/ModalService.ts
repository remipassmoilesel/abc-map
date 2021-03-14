import { Logger } from '@abc-map/frontend-shared';
import { InternalEvent, ModalEvent, ModalEventListener, ModalEventType, PasswordModalClosedEvent, RenameModalClosedEvent } from './Modals.types';

const logger = Logger.get('Modals.ts', 'warn');

export class ModalService {
  private eventTarget: EventTarget;
  private listeners = new Map<ModalEventListener, EventListener>();

  constructor() {
    this.eventTarget = document.createDocumentFragment();
  }

  public renameModal(title: string, message: string, value: string): Promise<RenameModalClosedEvent> {
    return new Promise((resolve) => {
      const listener: ModalEventListener = (ev) => {
        if (ev.type === ModalEventType.RenameClosed) {
          this.removeListener(ModalEventType.RenameClosed, listener);
          resolve(ev);
        }
      };

      this.addListener(ModalEventType.RenameClosed, listener);
      this.dispatch({ type: ModalEventType.ShowRename, title, message, value });
    });
  }

  public passwordModal(title: string, message: string): Promise<PasswordModalClosedEvent> {
    return new Promise((resolve) => {
      const listener: ModalEventListener = (ev) => {
        if (ev.type === ModalEventType.PasswordClosed) {
          this.removeListener(ModalEventType.PasswordClosed, listener);
          resolve(ev);
        }
      };

      this.addListener(ModalEventType.PasswordClosed, listener);
      this.dispatch({ type: ModalEventType.ShowPassword, title, message });
    });
  }

  public addListener(type: ModalEventType, listener: ModalEventListener) {
    const _listener: EventListener = (ev) => {
      if (!(ev instanceof InternalEvent)) {
        logger.error('Bad event received: ', ev);
        return;
      }
      listener(ev.payload);
    };
    this.eventTarget.addEventListener(type, _listener);
    this.listeners.set(listener, _listener);
  }

  public removeListener(type: ModalEventType, listener: ModalEventListener) {
    const _listener = this.listeners.get(listener);
    if (!_listener) {
      throw new Error(`Unknown listener`);
    }
    this.eventTarget.removeEventListener(type, _listener);
  }

  public dispatch(event: ModalEvent): void {
    logger.debug('Dispatch event: ', event);
    this.eventTarget.dispatchEvent(new InternalEvent(event.type, event));
  }
}
