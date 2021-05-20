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

import { Logger } from '@abc-map/shared';
import {
  FeaturePropertiesClosedEvent,
  InternalEvent,
  LoginClosedEvent,
  ModalEvent,
  ModalEventListener,
  ModalEventType,
  PasswordModalClosedEvent,
  RegistrationClosedEvent,
  RenameModalClosedEvent,
  SolicitationClosedEvent,
} from './typings';
import { SimplePropertiesMap } from '../geo/features/FeatureWrapper';

const logger = Logger.get('ModalService.ts', 'warn');

export class ModalService {
  private eventTarget: EventTarget;
  private listeners = new Map<ModalEventListener<any>, EventListener>();

  constructor() {
    this.eventTarget = document.createDocumentFragment();
  }

  public rename(title: string, message: string, value: string): Promise<RenameModalClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowRename, title, message, value }, ModalEventType.RenameClosed);
  }

  public projectPassword(): Promise<PasswordModalClosedEvent> {
    const message = 'Votre projet contient des identifiants, vous devez choisir un mot de passe pour les protéger.';
    const title = 'Mot de passe du projet';
    return this.passwordModal(title, message);
  }

  public passwordModal(title: string, message: string): Promise<PasswordModalClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowPassword, title, message }, ModalEventType.PasswordClosed);
  }

  public featurePropertiesModal(properties: SimplePropertiesMap): Promise<FeaturePropertiesClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowFeatureProperties, properties }, ModalEventType.FeaturePropertiesClosed);
  }

  public solicitation(): Promise<SolicitationClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowSolicitation }, ModalEventType.SolicitationClosed);
  }

  public login(): Promise<LoginClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowLogin }, ModalEventType.LoginClosed);
  }

  public registration(): Promise<RegistrationClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowRegistration }, ModalEventType.RegistrationClosed);
  }

  public passwordLost(): Promise<RegistrationClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowPasswordLost }, ModalEventType.PasswordLostClosed);
  }

  private modalPromise<O extends ModalEvent>(input: ModalEvent, closeEventType: ModalEventType): Promise<O> {
    return new Promise<O>((resolve) => {
      const listener: ModalEventListener = (ev) => {
        if (ev.type === closeEventType) {
          this.removeListener(closeEventType, listener);
          resolve(ev as O);
        } else {
          logger.warn('Unhandled modal event: ', ev);
        }
      };

      this.addListener(closeEventType, listener);
      this.dispatch(input);
    });
  }

  public addListener<T extends ModalEvent = ModalEvent>(type: ModalEventType, listener: ModalEventListener<T>) {
    const _listener: EventListener = (ev) => {
      if (!(ev instanceof InternalEvent) || ev.type !== type) {
        logger.error('Bad event received: ', ev);
        return;
      }
      listener(ev.payload as T);
    };
    this.eventTarget.addEventListener(type, _listener);
    this.listeners.set(listener, _listener);
  }

  public removeListener(type: ModalEventType, listener: ModalEventListener<any>) {
    const _listener = this.listeners.get(listener);
    this.listeners.delete(listener);
    if (!_listener) {
      logger.warn('Listener was not registered: ', _listener);
      return;
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
