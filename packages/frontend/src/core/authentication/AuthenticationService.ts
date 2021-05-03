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
  AccountConfirmationRequest,
  AccountConfirmationResponse,
  AnonymousUser,
  AuthenticationResponse,
  AuthenticationStatus,
  AuthenticationRequest,
  RegistrationResponse,
  RenewResponse,
  Token,
  UserStatus,
} from '@abc-map/shared-entities';
import { RegistrationRequest } from '@abc-map/shared-entities';
import { AuthenticationActions } from '../store/authentication/actions';
import jwtDecode from 'jwt-decode';
import { Logger } from '@abc-map/frontend-commons';
import { MainStore } from '../store/store';
import { ToastService } from '../ui/ToastService';

const logger = Logger.get('AuthenticationService.ts', 'info');

export class AuthenticationService {
  private tokenInterval: any;

  constructor(private httpClient: AxiosInstance, private store: MainStore, private toasts: ToastService) {}

  public watchToken() {
    this.tokenInterval = setInterval(() => {
      logger.info('Token renewed');
      this.renew().catch((err) => logger.error(err));
    }, 20 * 60 * 1000);
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

  /**
   * This method authenticate user.
   *
   * This methods return a promise which resolve if
   *
   * Promise will reject if an error occurs.
   * @param email
   * @param password
   */
  public login(email: string, password: string): Promise<void> {
    const request: AuthenticationRequest = { email, password };
    return this.httpClient
      .post<AuthenticationResponse>(Api.login(), request)
      .then(async (res) => {
        const auth: AuthenticationResponse = res.data;
        if (auth.token) {
          this.dispatchToken(auth.token);
        }
        return auth;
      })
      .catch((err?: any) => {
        if (err?.response && err?.response.data?.status) {
          return err?.response.data;
        }
        return Promise.reject(err);
      })
      .then((res) => {
        const isAuthenticated = this.store.getState().authentication.userStatus === UserStatus.Authenticated;

        if (AuthenticationStatus.Successful === res.status) {
          isAuthenticated && this.toasts.info('Vous êtes connecté !');
          return Promise.resolve();
        }
        if (AuthenticationStatus.DisabledUser === res.status) {
          this.toasts.error('Vous devez activer votre compte avant de vous connecter. Vérifiez vos e-mails et vos spams.');
          return Promise.reject(new Error(AuthenticationStatus.DisabledUser));
        }
        if (AuthenticationStatus.Refused === res.status) {
          this.toasts.error('Vos identifiants sont incorrects.');
          return Promise.reject(new Error(AuthenticationStatus.Refused));
        }
        if (AuthenticationStatus.UnknownUser === res.status) {
          this.toasts.error("Cette adresse email n'est pas enregistrée.");
          return Promise.reject(new Error(AuthenticationStatus.UnknownUser));
        }

        logger.error('Invalid login status: ', res);
        this.toasts.genericError();
        return Promise.reject(new Error('Invalid login status'));
      });
  }

  public renew(): Promise<void> {
    return this.httpClient.get<RenewResponse>(Api.renew()).then((result) => {
      this.dispatchToken(result.data.token);
    });
  }

  public register(email: string, password: string): Promise<RegistrationResponse> {
    const request: RegistrationRequest = { email, password };
    return this.httpClient.post<RegistrationResponse>(Api.register(), request).then((res) => res.data);
  }

  public confirmAccount(userId: string, secret: string): Promise<AccountConfirmationResponse> {
    const request: AccountConfirmationRequest = { userId, secret };
    return this.httpClient.post(Api.confirmAccount(), request).then((res) => {
      const confirm: AccountConfirmationResponse = res.data;
      if (confirm.token) {
        this.dispatchToken(confirm.token);
      }
      return confirm;
    });
  }

  private dispatchToken(token: string): void {
    const decoded = jwtDecode<Token>(token);
    this.store.dispatch(AuthenticationActions.login(decoded, token));
  }
}
