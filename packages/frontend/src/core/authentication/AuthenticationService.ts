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

import { AxiosError, AxiosInstance } from 'axios';
import { AuthenticationRoutes as Api } from '../http/ApiRoutes';
import {
  AnonymousUser,
  AuthenticationRequest,
  AuthenticationResponse,
  AuthenticationToken,
  PasswordLostRequest,
  RegistrationConfirmationRequest,
  RegistrationConfirmationResponse,
  RegistrationRequest,
  RegistrationResponse,
  RegistrationStatus,
  RenewResponse,
  ResetPasswordRequest,
  UserStatus,
} from '@abc-map/shared-entities';
import { AuthenticationActions } from '../store/authentication/actions';
import jwtDecode from 'jwt-decode';
import { Logger } from '@abc-map/frontend-commons';
import { MainStore } from '../store/store';
import { ToastService } from '../ui/ToastService';
import { TokenHelper } from './TokenHelper';

const logger = Logger.get('AuthenticationService.ts', 'info');

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

  public getUserStatus(): UserStatus | undefined {
    return this.store.getState().authentication.userStatus;
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
      .post<AuthenticationResponse>(Api.login(), request)
      .then(async (res) => {
        const auth: AuthenticationResponse = res.data;
        if (auth.token) {
          this.dispatchToken(auth.token);
        }

        if (UserStatus.Authenticated === this.store.getState().authentication.userStatus) {
          this.toasts.info('Vous êtes connecté !');
        }
        return Promise.resolve();
      })
      .catch((err: AxiosError | Error | undefined) => {
        logger.error('Authentication error: ', err);
        if (err && 'response' in err && err.response?.data?.status) {
          logger.error(err.response?.data);
          this.toasts.error('Vos identifiants sont incorrects');
        }
        return Promise.reject(err);
      });
  }

  public passwordLost(email: string): Promise<void> {
    const req: PasswordLostRequest = { email };
    return this.httpClient.post(Api.password(), req);
  }

  public resetPassword(token: string, password: string): Promise<void> {
    const req: ResetPasswordRequest = { token, password };
    return this.httpClient
      .patch(Api.password(), req)
      .then(() => undefined)
      .catch((err) => {
        this.toasts.genericError();
        return Promise.reject(err);
      });
  }

  public renewToken(): Promise<void> {
    return this.httpClient.post<RenewResponse>(Api.renew()).then((result) => {
      this.dispatchToken(result.data.token);
    });
  }

  public registration(email: string, password: string): Promise<RegistrationResponse> {
    const request: RegistrationRequest = { email, password };
    return this.httpClient
      .post<RegistrationResponse>(Api.registration(), request)
      .then((res) => {
        const registration: RegistrationResponse = res.data;
        if (res.data.status === RegistrationStatus.Successful) {
          this.toasts.info('Un email vient de vous être envoyé, vous devez activer votre compte');
          return registration;
        }

        this.toasts.genericError();
        return Promise.reject(new Error('Invalid registration status'));
      })
      .catch((err: AxiosError | Error | undefined) => {
        logger.error('Registration error: ', err);
        if (err && 'response' in err && err.response?.data?.status === RegistrationStatus.EmailAlreadyExists) {
          this.toasts.info('Cette adresse email est déjà prise');
        } else {
          this.toasts.genericError();
        }
        return Promise.reject(err);
      });
  }

  public confirmRegistration(token: string): Promise<RegistrationConfirmationResponse> {
    const request: RegistrationConfirmationRequest = { token };
    return this.httpClient
      .post(Api.confirmRegistration(), request)
      .then((res) => {
        const response: RegistrationConfirmationResponse = res.data;
        if (response.token) {
          this.dispatchToken(response.token);
        }
        return response;
      })
      .catch((err) => {
        this.toasts.genericError();
        return Promise.reject(err);
      });
  }

  private dispatchToken(token: string): void {
    const decoded = jwtDecode<AuthenticationToken>(token);
    this.store.dispatch(AuthenticationActions.login(decoded, token));
  }
}
