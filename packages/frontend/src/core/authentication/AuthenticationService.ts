import { AxiosInstance } from 'axios';
import { AuthenticationRoutes as Api } from '../http/ApiRoutes';
import {
  AccountConfirmationRequest,
  AccountConfirmationResponse,
  AnonymousUser,
  AuthenticationResponse,
  LoginRequest,
  RegistrationResponse,
  Token,
} from '@abc-map/shared-entities';
import { RegistrationRequest } from '@abc-map/shared-entities';
import { AuthenticationActions } from '../store/authentication/actions';
import jwtDecode from 'jwt-decode';
import { Logger } from '../utils/Logger';
import { MainStore } from '../store/store';

const logger = Logger.get('AuthenticationService.ts');

export class AuthenticationService {
  constructor(private httpClient: AxiosInstance, private store: MainStore) {}

  public logout(): Promise<AuthenticationResponse> {
    return this.anonymousLogin();
  }

  public anonymousLogin(): Promise<AuthenticationResponse> {
    return this.login(AnonymousUser.email, AnonymousUser.password);
  }

  /**
   * This method authenticate user.
   *
   * It returns a promise which resolve if credentials are correct or not.
   *
   * Promise will reject if an error occurs.
   * @param email
   * @param password
   */
  public login(email: string, password: string): Promise<AuthenticationResponse> {
    const request: LoginRequest = { email, password };
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
