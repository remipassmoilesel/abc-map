import {Injectable, OnInit} from '@angular/core';
import {AuthenticationClient} from './AuthenticationClient';
import {ILoginRequest, IUserCreationRequest} from 'abcmap-shared';
import {ToastService} from '../notifications/toast.service';
import {tap} from 'rxjs/operators';
import {LocalStorageService, LSKey} from '../local-storage/local-storage.service';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {UserModule} from '../../store/user/user-actions';
import UserLogin = UserModule.UserLogin;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private client: AuthenticationClient,
              private localStorage: LocalStorageService,
              private store: Store<IMainState>,
              private toasts: ToastService) {
  }

  public checkIfUserWasConnected(): void {
    const storedUsername = localStorage.getItem(LSKey.USERNAME);
    const storedToken = localStorage.getItem(LSKey.USER_TOKEN);
    if (storedUsername && storedToken) {
      console.warn('User was already logged in');
      this.store.dispatch(new UserLogin({username: storedUsername, token: storedToken}));
    }
  }

  public getToken(): string | null {
    return this.localStorage.get(LSKey.USER_TOKEN);
  }

  private storeUser(username: string, token: string): void {
    this.localStorage.save(LSKey.USERNAME, username);
    this.localStorage.save(LSKey.USER_TOKEN, token);
  }

  public registerUser(request: IUserCreationRequest) {
    return this.client.registerUser(request)
      .pipe(
        tap(res => this.toasts.info('Vous êtes inscrit !'),
          err => this.toasts.error('Erreur lors de l\'inscription, veuillez réessayer plus tard !'))
      );
  }

  public login(request: ILoginRequest) {
    return this.client.login(request)
      .pipe(
        tap(res => {
            this.toasts.info('Vous êtes connecté !');
            this.storeUser(request.username, res.token);
            this.store.dispatch(new UserLogin({username: request.username, token: res.token}));
          },
          err => this.toasts.error('Identifiants incorrects !'))
      );
  }
}
