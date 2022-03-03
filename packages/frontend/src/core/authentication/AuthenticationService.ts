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
  Logger,
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
import { MainStore } from '../store/store';
import { TokenHelper } from './TokenHelper';
import { HttpError } from '../http/HttpError';
import { getLang } from '../../i18n/i18n';
import { AuthenticationError, ErrorType } from './AuthenticationError';

const logger = Logger.get('AuthenticationService.ts');

const Disconnect = 'disconnect';

export class AuthenticationService {
  private eventTarget = document.createDocumentFragment();
  private tokenInterval: any;

  constructor(private httpClient: AxiosInstance, private store: MainStore) {}

  public watchToken() {
    this.tokenInterval = setInterval(() => {
      this.renewToken()
        .then(() => logger.info('Token renewed'))
        .catch((err) => logger.error('Cannot renew token: ', err));
    }, 5 * 60 * 1000);
  }

  public unwatchToken() {
    clearInterval(this.tokenInterval);
  }

  /**
   * Renew token if expires soon.
   *
   * If this method fail, an anonymous authentication will occur.
   */
  public async renewToken(): Promise<void> {
    const token = this.store.getState().authentication.tokenString;
    if (!token) {
      return;
    }

    if (TokenHelper.getRemainingSecBeforeExpiration(token) < 10 * 60) {
      return this.httpClient.get<RenewResponse>(Api.token()).then((result) => {
        logger.info('Token renewed');
        this.dispatchToken(result.data.token);
      });
    }
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
    return this.anonymousLogin().then(() => {
      this.eventTarget.dispatchEvent(new CustomEvent(Disconnect));
    });
  }

  public anonymousLogin(): Promise<void> {
    return this.login(AnonymousUser.email, AnonymousUser.password).then(() => undefined);
  }

  public login(email: string, password: string): Promise<UserStatus> {
    const request: AuthenticationRequest = { email, password };
    return this.httpClient
      .post<AuthenticationResponse>(Api.authentication(), request)
      .then(async (res) => {
        const auth: AuthenticationResponse = res.data;
        if (auth.token) {
          return this.dispatchToken(auth.token);
        }
        // This should never happen
        else {
          logger.error('No token found in response');
          return UserStatus.Anonymous;
        }
      })
      .catch((err) => {
        if (HttpError.isUnauthorized(err)) {
          return Promise.reject(new AuthenticationError(ErrorType.InvalidCredentials));
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
          return Promise.reject(new AuthenticationError(ErrorType.InvalidCredentials));
        }

        return Promise.reject(err);
      });
  }

  public passwordLost(email: string): Promise<void> {
    const req: PasswordLostRequest = { email, lang: getLang() };
    return this.httpClient.post(Api.passwordResetEmail(), req).then(() => undefined);
  }

  public resetPassword(token: string, password: string): Promise<void> {
    const req: ResetPasswordRequest = { token, password };
    return this.httpClient.post(Api.password(), req).then(() => undefined);
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

        return Promise.reject(new Error('Invalid registration status'));
      })
      .catch((err) => {
        logger.error('Registration error: ', err);
        if (HttpError.isConflict(err)) {
          return Promise.reject(new AuthenticationError(ErrorType.EmailAlreadyInUse));
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
          return Promise.reject(new AuthenticationError(ErrorType.InvalidCredentials));
        }

        return Promise.reject(err);
      });
  }

  private dispatchToken(token: string): UserStatus {
    const decoded = jwtDecode<AuthenticationToken>(token);
    this.store.dispatch(AuthenticationActions.login(decoded, token));
    return decoded.userStatus;
  }

  public addDisconnectListener(handler: () => void) {
    this.eventTarget.addEventListener(Disconnect, handler);
  }

  public removeDisconnectListener(handler: () => void) {
    this.eventTarget.removeEventListener(Disconnect, handler);
  }
}
