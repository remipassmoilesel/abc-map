import { Logger } from '@abc-map/frontend-commons';
import {
  FeaturePropertiesClosedEvent,
  InternalEvent,
  ModalEvent,
  ModalEventListener,
  ModalEventType,
  PasswordModalClosedEvent,
  RenameModalClosedEvent,
} from './Modals.types';
import { SimplePropertiesMap } from '../geo/features/FeatureWrapper';

const logger = Logger.get('ModalService.ts', 'warn');

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

  public projectPasswordModal(): Promise<PasswordModalClosedEvent> {
    const message = 'Votre projet contient des identifiants, vous devez choisir un mot de passe pour les protéger.';
    const title = 'Mot de passe du projet';
    return this.passwordModal(title, message);
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

  public featurePropertiesModal(properties: SimplePropertiesMap): Promise<FeaturePropertiesClosedEvent> {
    return new Promise((resolve) => {
      const listener: ModalEventListener = (ev) => {
        if (ev.type === ModalEventType.FeaturePropertiesClosed) {
          this.removeListener(ModalEventType.FeaturePropertiesClosed, listener);
          resolve(ev);
        }
      };

      this.addListener(ModalEventType.FeaturePropertiesClosed, listener);
      this.dispatch({ type: ModalEventType.ShowFeatureProperties, properties });
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
    this.listeners.delete(listener);
    if (!_listener) {
      throw new Error(`Unknown listener`);
    }
    this.eventTarget.removeEventListener(type, _listener);
  }

  public dispatch(event: ModalEvent): void {
    logger.debug('Dispatch event: ', event);
    this.eventTarget.dispatchEvent(new InternalEvent(event.type, event));
  }

  public getListeners() {
    return this.listeners;
  }
}
