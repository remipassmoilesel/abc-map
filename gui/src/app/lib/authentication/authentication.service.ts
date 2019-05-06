import {Injectable, OnDestroy} from '@angular/core';
import {AuthenticationClient} from './AuthenticationClient';
import {ILoginRequest, IUserCreationRequest} from 'abcmap-shared';
import {ToastService} from '../notifications/toast.service';
import {tap} from 'rxjs/operators';
import {LocalStorageService, LSKey} from '../local-storage/local-storage.service';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {UserModule} from '../../store/user/user-actions';
import {Subscription} from 'rxjs';
import {RxUtils} from '../utils/RxUtils';
import UserLogin = UserModule.UserLogin;
import UserLogout = UserModule.UserLogout;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

  private logout$?: Subscription;

  constructor(private client: AuthenticationClient,
              private localst: LocalStorageService,
              private store: Store<IMainState>,
              private toasts: ToastService) {
    this.checkIfUserWasConnected();
    this.deleteLocalstorageOnLogout();
  }

  ngOnDestroy(): void {
    RxUtils.unsubscribe(this.logout$);
  }

  private deleteLocalstorageOnLogout(): void {
    this.logout$ = this.store.select(state => state.user.loggedIn)
      .subscribe(loggedIn => {
        if (!loggedIn) {
          this.storeUserInformations('', '');
        }
      });
  }

  public checkIfUserWasConnected(): void {
    const storedUsername = this.localst.get(LSKey.USERNAME);
    const storedToken = this.localst.get(LSKey.USER_TOKEN);
    if (storedUsername && storedToken) {
      console.warn('User was already logged in');
      this.store.dispatch(new UserLogin({username: storedUsername, token: storedToken}));
    }
  }

  public getToken(): string | null {
    return this.localst.get(LSKey.USER_TOKEN);
  }

  private storeUserInformations(username: string, token: string): void {
    this.localst.save(LSKey.USERNAME, username);
    this.localst.save(LSKey.USER_TOKEN, token);
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
            this.storeUserInformations(request.username, res.token);
            this.store.dispatch(new UserLogin({username: request.username, token: res.token}));
          },
          err => this.toasts.error('Identifiants incorrects !'))
      );
  }

  public logout() {
    this.store.dispatch(new UserLogout());
  }
}
