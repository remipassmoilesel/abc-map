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
  CreatePasswordModalClosedEvent,
  EditPropertiesClosedEvent,
  LoginClosedEvent,
  ModalEvent,
  ModalEventListener,
  ModalEventType,
  ModalStatus,
  OperationStatus,
  PasswordInputClosedEvent,
  PromptVariablesClosed,
  PwaInstallClosed,
  RegistrationClosedEvent,
  SimplePromptClosed,
  SolicitationClosedEvent,
  TextFeedbackClosed,
} from './typings';
import { DataPropertiesMap } from '../geo/features/FeatureWrapper';
import { resolveInAtLeast } from '../utils/resolveInAtLeast';
import { prefixedTranslation } from '../../i18n/i18n';
import { PromptDefinition } from './PromptDefinition';
import EventEmitter from 'eventemitter3';

const logger = Logger.get('ModalService.ts', 'warn');

const t = prefixedTranslation('ModalService:');

export class ModalService {
  private emitter = new EventEmitter();

  public prompt(title: string, message: string, value: string, validationRegexp: RegExp, validationErrorMessage: string): Promise<SimplePromptClosed> {
    const input: ModalEvent = { type: ModalEventType.ShowSimplePrompt, title, message, value, validationRegexp, validationErrorMessage };
    return this.modalPromise<SimplePromptClosed>(input, ModalEventType.SimplePromptClosed);
  }

  public confirmation(title: string, message: string): Promise<ModalStatus> {
    const input: ModalEvent = { type: ModalEventType.ShowConfirmation, title, message };
    return this.modalPromise<ConfirmationClosedEvent>(input, ModalEventType.ConfirmationClosed).then((res) => res.status);
  }

  /**
   * Show a modal with two password input fields, allowing the user to create a new password
   * @param title
   * @param message
   */
  public createPassword(title: string, message: string): Promise<CreatePasswordModalClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowSetPassword, title, message }, ModalEventType.CreatePasswordClosed);
  }

  public promptPassword(title: string, message: string, witness: string): Promise<PasswordInputClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowPasswordInput, title, message, witness }, ModalEventType.PasswordPromptClosed);
  }

  public editPropertiesModal(properties: DataPropertiesMap): Promise<EditPropertiesClosedEvent> {
    return this.modalPromise({ type: ModalEventType.ShowEditProperties, properties }, ModalEventType.FeaturePropertiesClosed);
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

  public textFeedback(): Promise<TextFeedbackClosed> {
    return this.modalPromise({ type: ModalEventType.ShowTextFeedback }, ModalEventType.TextFeedbackClosed);
  }

  public pwaInstall(): Promise<PwaInstallClosed> {
    return this.modalPromise({ type: ModalEventType.ShowPwaInstall }, ModalEventType.PwaInstallClosed);
  }

  /**
   * Sometimes it is necessary to block the whole UI while an operation is in progress.
   *
   * You can use this method to block UI while returned promise does not resolve.
   *
   * This is generally a bad UX practice.
   *
   * @param operation
   */
  public longOperationModal<Result = void>(operation: () => Promise<OperationStatus | [OperationStatus, Result]>): Promise<OperationStatus | Result> {
    // We show waiting screen
    this.dispatch({ type: ModalEventType.ShowLongOperationModal, processing: true });

    return new Promise<OperationStatus | Result>((resolve, reject) => {
      const start = () => resolveInAtLeast(operation(), 1000).then(hideOnSuccess).catch(hideOnFail);

      const hideOnSuccess = (_result: OperationStatus | [OperationStatus, Result]) => {
        const status = Array.isArray(_result) ? _result[0] : _result;
        const result = Array.isArray(_result) ? _result[1] : _result;

        // Operation was interrupted (per example canceled)
        if (status === OperationStatus.Interrupted) {
          this.dispatch({ type: ModalEventType.LongOperationModalClosed });
          resolve(result ?? OperationStatus.Interrupted);
          return;
        }

        // We show end of waiting screen
        this.dispatch({ type: ModalEventType.ShowLongOperationModal, processing: false });

        setTimeout(() => {
          this.dispatch({ type: ModalEventType.LongOperationModalClosed });

          // Then we resolve with result or status
          resolve(result ?? OperationStatus.Succeed);
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
      title: `${t('Current_changes')} ✍️`,
      message: `
          <div class='my-3'>${t('Current_changes_will_be_lost')}</div>
          <div class='my-3'>${t('If_project_saved_ignore_this_message')}</div>
      `,
    };
    return this.modalPromise<ConfirmationClosedEvent>(input, ModalEventType.ConfirmationClosed).then((res) => res.status);
  }

  public dataSizeWarning(): Promise<ModalStatus> {
    const input: ModalEvent = {
      type: ModalEventType.ShowConfirmation,
      title: `${t('Heavy_dataset')} 🏋️`,
      message: `
          <div class='my-3'>${t('You_are_about_to_import_heavy_dataset')}</div>
          <div class='my-3'>${t('AbcMap_not_yet_ready_for_heavy_dataset')}</div>
          <div class='my-3'>${t('Prefer_small_dataset')}</div>
      `,
    };
    return this.modalPromise<ConfirmationClosedEvent>(input, ModalEventType.ConfirmationClosed).then((res) => res.status);
  }

  public promptVariables(title: string, message: string, definitions: PromptDefinition[]): Promise<PromptVariablesClosed> {
    const input: ModalEvent = { type: ModalEventType.ShowPromptVariables, title, message, definitions };
    return this.modalPromise<PromptVariablesClosed>(input, ModalEventType.PromptVariablesClosed);
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
    this.emitter.addListener(type, listener);
  }

  public removeListener(type: ModalEventType, listener: ModalEventListener<any>) {
    this.emitter.removeListener(type, listener);
  }

  public dispatch(event: ModalEvent): void {
    logger.debug('Dispatch event: ', event);
    this.emitter.emit(event.type, event);
  }
}
