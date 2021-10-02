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
  ConfirmationClosedEvent,
  FeaturePropertiesClosedEvent,
  InternalEvent,
  LegendSymbolPickerClosedEvent,
  LoginClosedEvent,
  ModalEvent,
  ModalEventListener,
  ModalEventType,
  ModalStatus,
  OperationStatus,
  PasswordInputClosedEvent,
  RegistrationClosedEvent,
  RenameModalClosedEvent,
  SetPasswordModalClosedEvent,
  SolicitationClosedEvent,
} from './typings';
import { SimplePropertiesMap } from '../geo/features/FeatureWrapper';
import { delayedPromise } from '../utils/delayedPromise';

const logger = Logger.get('ModalService.ts', 'warn');

export class ModalService {
  private eventTarget = document.createDocumentFragment();
  private listeners = new Map<ModalEventListener<any>, EventListener>();

  public rename(message: string, value: string): Promise<RenameModalClosedEvent> {
    const title = 'Renommage ✏️';
    return this.modalPromise({ type: ModalEventType.ShowRename, title, message, value }, ModalEventType.RenameClosed);
  }

  public setProjectPassword(): Promise<SetPasswordModalClosedEvent> {
    const title = 'Mot de passe du projet 🔑';
    const message = 'Votre projet contient des identifiants, vous devez choisir un mot de passe pour les protéger.';
    return this.setPasswordModal(title, message);
  }

  public passwordInputModal(title: string, message: string, witness: string): Promise<PasswordInputClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowPasswordInput, title, message, witness }, ModalEventType.PasswordInputClosed);
  }

  public getProjectPassword(witness: string): Promise<PasswordInputClosedEvent> {
    const title = 'Mot de passe du projet 🔑';
    const message = 'Votre projet est protégé par un mot de passe.';
    return this.passwordInputModal(title, message, witness);
  }

  public setPasswordModal(title: string, message: string): Promise<SetPasswordModalClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowSetPassword, title, message }, ModalEventType.SetPasswordClosed);
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

  public legendSymbolPicker(): Promise<LegendSymbolPickerClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowLegendSymbolPicker }, ModalEventType.LegendSymbolPickerClosed);
  }

  public longOperationModal<Result = void>(operation: () => Promise<OperationStatus | Result>): Promise<OperationStatus | Result> {
    // We show waiting screen
    this.dispatch({ type: ModalEventType.ShowLongOperationModal, burning: true });

    return new Promise<OperationStatus | Result>((resolve, reject) => {
      const start = () => {
        return delayedPromise(operation(), 1000).then(hideOnSuccess).catch(hideOnFail);
      };

      const hideOnSuccess = (res: OperationStatus | Result) => {
        // Operation was interrupted (per example canceled), we resolve with status
        if (res === OperationStatus.Interrupted) {
          this.dispatch({ type: ModalEventType.LongOperationModalClosed });
          resolve(OperationStatus.Interrupted);
          return;
        }

        // We show end of waiting screen
        this.dispatch({ type: ModalEventType.ShowLongOperationModal, burning: false });

        setTimeout(() => {
          this.dispatch({ type: ModalEventType.LongOperationModalClosed });

          // Then we resolve with result or status
          resolve(res ?? OperationStatus.Succeed);
        }, 800);
      };

      const hideOnFail = (err: Error) => {
        this.dispatch({ type: ModalEventType.LongOperationModalClosed });
        reject(err);
      };

      // We let frontend refresh before operation
      setTimeout(start, 150);
    });
  }

  public modificationsLostConfirmation(): Promise<ModalStatus> {
    const input: ModalEvent = {
      type: ModalEventType.ShowConfirmation,
      title: 'Modifications en cours ✍️',
      message: `
          <div class='my-3'>
            Si vous continuez, les modifications en cours seront perdues.
          </div>
          <div class='my-3'>
            Si vous avez exporté ou sauvegardé votre projet vous pouvez ignorer ce message.
          </div>`,
    };
    return this.modalPromise<ConfirmationClosedEvent>(input, ModalEventType.ConfirmationClosed).then((res) => res.status);
  }

  public dataSizeWarning(): Promise<ModalStatus> {
    const input: ModalEvent = {
      type: ModalEventType.ShowConfirmation,
      title: 'Jeu de données lourd 🏋️',
      message: `
          <div class='my-3'>
            Vous êtes sur le point d'importer une grande quantité de données.
          </div>
          <div class='my-3'>
            Abc-Map n'est pas encore prêt pour accueillir des jeux de données lourds, vous risquez de ralentir et de bloquer votre session.
          </div>
          <div class='my-3'>
            Pour le moment préférez des fichiers de <code>moins de 5 mo</code> et des couches de <code>moins de 1000 géométries</code>.
            Dans un futur proche, vous pourrez utiliser plus de données.
          </div>
      `,
    };
    return this.modalPromise<ConfirmationClosedEvent>(input, ModalEventType.ConfirmationClosed).then((res) => res.status);
  }

  public confirmation(title: string, message: string): Promise<ModalStatus> {
    const input: ModalEvent = { type: ModalEventType.ShowConfirmation, title, message };
    return this.modalPromise<ConfirmationClosedEvent>(input, ModalEventType.ConfirmationClosed).then((res) => res.status);
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
    // We create a listener wrapper that filters events
    const _listener: EventListener = (ev) => {
      if (!(ev instanceof InternalEvent) || ev.payload.type !== type) {
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
    if (!_listener) {
      logger.warn('Listener was not registered: ', _listener);
      return;
    }

    this.listeners.delete(listener);
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
