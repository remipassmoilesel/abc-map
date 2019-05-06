import {Injectable, OnDestroy} from '@angular/core';

import * as _ from 'lodash';
import {Router} from '@angular/router';
import {GuiRoute, GuiRoutes} from '../../app-routing.module';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {RxUtils} from '../utils/RxUtils';


export interface IArgMap {
  [k: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoutingService implements OnDestroy {

  private logout$?: Subscription;

  constructor(private router: Router,
              private store: Store<IMainState>) {
    this.redirectAfterLogin();
  }

  ngOnDestroy(): void {
    RxUtils.unsubscribe(this.logout$);
  }

  private redirectAfterLogin() {
    this.logout$ = this.store.select(state => state.user.loggedIn)
      .subscribe(res => {
        this.navigate(GuiRoutes.MAP);
      });
  }

  public navigate(route: GuiRoute, args?: IArgMap) {
    const path = args ? this.replaceArguments(args, route) : route;
    if (path.match(':')) {
      throw new Error(`Some path variables are missing: ${path}`);
    }
    return this.router.navigateByUrl('/' + path);
  }

  private replaceArguments(args: IArgMap, oldPath: string): string {
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

}

