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

import { AxiosInstance } from 'axios';
import { AuthenticationRoutes as Api } from '../http/ApiRoutes';
import {
  AnonymousUser,
  AuthenticationRequest,
  AuthenticationResponse,
  AuthenticationToken,
  DeleteAccountRequest,
  PasswordLostRequest,
  RegistrationConfirmationRequest,
  RegistrationConfirmationResponse,
  RegistrationRequest,
  RegistrationResponse,
  RegistrationStatus,
  RenewResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UserStatus,
} from '@abc-map/shared';
import { AuthenticationActions } from '../store/authentication/actions';
import jwtDecode from 'jwt-decode';
import { Logger } from '@abc-map/shared';
import { MainStore } from '../store/store';
import { ToastService } from '../ui/ToastService';
import { TokenHelper } from './TokenHelper';
import { HttpError } from '../http/HttpError';
import { getLang, prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('AuthenticationService.ts');

const t = prefixedTranslation('core:AuthentificationService.');

export class AuthenticationService {
  private tokenInterval: any;

  constructor(private httpClient: AxiosInstance, private store: MainStore, private toasts: ToastService) {}

  public watchToken() {
    this.tokenInterval = setInterval(() => {
      const token = this.store.getState().authentication.tokenString;
      if (!token) {
        return;
      }

      if (TokenHelper.getRemainingSecBeforeExpiration(token) < 10 * 60) {
        this.renewToken()
          .then(() => logger.info('Token renewed'))
          .catch((err) => logger.error('Cannot renew token: ', err));
      }
    }, 5 * 60 * 1000);
  }

  public unwatchToken() {
    clearInterval(this.tokenInterval);
  }

  /**
   * Return status of user:
   * - 'Authenticated' if authenticated with username and password
   * - 'Anonymous' if authenticated with anonymous credentials
   * - 'false' if not authenticated
   */
  public getUserStatus(): UserStatus | false {
    return this.store.getState().authentication.userStatus ?? false;
  }

  public logout(): Promise<void> {
    return this.anonymousLogin();
  }

  public anonymousLogin(): Promise<void> {
    return this.login(AnonymousUser.email, AnonymousUser.password);
  }

  public login(email: string, password: string): Promise<void> {
    const request: AuthenticationRequest = { email, password };
    return this.httpClient
      .post<AuthenticationResponse>(Api.authentication(), request)
      .then(async (res) => {
        const auth: AuthenticationResponse = res.data;
        if (auth.token) {
          this.dispatchToken(auth.token);
        }

        if (UserStatus.Authenticated === this.store.getState().authentication.userStatus) {
          this.toasts.info(t('You_are_connected'));
        }
      })
      .catch((err) => {
        if (HttpError.isUnauthorized(err)) {
          this.toasts.error(t('Invalid_credentials'));
        } else {
          this.toasts.httpError(err);
        }
        return Promise.reject(err);
      });
  }

  public updatePassword(previousPassword: string, newPassword: string): Promise<void> {
    const req: UpdatePasswordRequest = { previousPassword, newPassword };
    return this.httpClient
      .patch(Api.password(), req)
      .then(() => undefined)
      .catch((err) => {
        if (HttpError.isForbidden(err)) {
          this.toasts.error(t('Your_password_is_incorrect'));
        } else {
          this.toasts.httpError(err);
        }
        return Promise.reject(err);
      });
  }

  public passwordLost(email: string): Promise<void> {
    const req: PasswordLostRequest = { email, lang: getLang() };
    return this.httpClient
      .post(Api.passwordResetEmail(), req)
      .then(() => undefined)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  public resetPassword(token: string, password: string): Promise<void> {
    const req: ResetPasswordRequest = { token, password };
    return this.httpClient
      .post(Api.password(), req)
      .then(() => undefined)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  public renewToken(): Promise<void> {
    return this.httpClient.get<RenewResponse>(Api.token()).then((result) => {
      this.dispatchToken(result.data.token);
    });
  }

  public registration(email: string, password: string): Promise<RegistrationResponse> {
    const request: RegistrationRequest = { email, password, lang: getLang() };
    return this.httpClient
      .post<RegistrationResponse>(Api.account(), request)
      .then((res) => {
        const registration: RegistrationResponse = res.data;
        if (res.data.status === RegistrationStatus.Successful) {
          return registration;
        }

        this.toasts.genericError();
        return Promise.reject(new Error('Invalid registration status'));
      })
      .catch((err) => {
        logger.error('Registration error: ', err);
        if (HttpError.isConflict(err)) {
          this.toasts.info(t('This_email_address_is_already_in_use'));
        } else {
          this.toasts.httpError(err);
        }
        return Promise.reject(err);
      });
  }

  public confirmRegistration(token: string): Promise<RegistrationConfirmationResponse> {
    const request: RegistrationConfirmationRequest = { token };
    return this.httpClient.post(Api.accountConfirmation(), request).then((res) => {
      const response: RegistrationConfirmationResponse = res.data;
      if (response.token) {
        this.dispatchToken(response.token);
      }
      return response;
    });
  }

  public deleteAccount(password: string): Promise<void> {
    const request: DeleteAccountRequest = { password };
    return this.httpClient
      .delete(Api.authentication(), { data: request })
      .then(() => undefined)
      .catch((err) => {
        if (HttpError.isForbidden(err)) {
          this.toasts.error(t('Your_password_is_incorrect'));
        } else {
          this.toasts.httpError(err);
        }
        return Promise.reject(err);
      });
  }

  private dispatchToken(token: string): void {
    const decoded = jwtDecode<AuthenticationToken>(token);
    this.store.dispatch(AuthenticationActions.login(decoded, token));
  }
}
