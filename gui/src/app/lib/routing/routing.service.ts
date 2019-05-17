import {Injectable, OnDestroy} from '@angular/core';

import * as _ from 'lodash';
import {Router} from '@angular/router';
import {GuiRoute, GuiRoutes} from '../../app-routing.module';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {RxUtils} from '../utils/RxUtils';
import {Actions, ofType} from '@ngrx/effects';
import {ProjectModule} from '../../store/project/project-actions';
import ProjectActions = ProjectModule.ActionTypes;


export interface IRouteArgMap {
  [k: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoutingService implements OnDestroy {

  private loginState$?: Subscription;

  constructor(private router: Router,
              private actions: Actions,
              private store: Store<IMainState>) {
    this.redirectAfterLogin();
    this.redirectAfterImport();
  }

  ngOnDestroy(): void {
    RxUtils.unsubscribe(this.loginState$);
  }

  private redirectAfterLogin() {
    this.loginState$ = this.store.select(state => state.user.loggedIn)
      .subscribe(isConnected => {
        if (!isConnected || this.shouldRedirectAfterLoginAction()) {
          this.navigate(GuiRoutes.MAP);
        }
      });
  }

  private redirectAfterImport() {
    this.loginState$ = this.actions.pipe(
      ofType(ProjectActions.DATA_IMPORTED_AS_LAYER)
    )
      .subscribe(action => this.navigate(GuiRoutes.MAP));
  }

  public navigate(route: GuiRoute, args?: IRouteArgMap) {
    const path = args ? this.replaceArguments(args, route) : route;
    if (path.match(':')) {
      throw new Error(`Some path variables are missing: ${path}`);
    }
    return this.router.navigateByUrl('/' + path);
  }

  private replaceArguments(args: IRouteArgMap, oldPath: string): string {
    let result = oldPath;
    _.forEach(args, (value: string, key: string) => {
      this.throwIfArgumentNotPresent(key, oldPath);
      result = result.replace(':' + key, value);
    });
    return result;
  }

  private throwIfArgumentNotPresent(key: string, path: string): void {
    if (path.search(':' + key) === -1) {
      throw new Error(`Arg not found arg=:${key} path=${path}`);
    }
  }

  private shouldRedirectAfterLoginAction(): boolean {
    const currentRoute = document.location.href;
    return currentRoute.endsWith(GuiRoutes.LOGIN) || currentRoute.endsWith(GuiRoutes.REGISTER);
  }
}

