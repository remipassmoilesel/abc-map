import {Injectable} from '@angular/core';

import * as _ from 'lodash';
import {Router} from '@angular/router';
import {AbcRoute} from '../../app-routing.module';


export interface IArgMap {
  [k: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) {
  }

  public navigate(route: AbcRoute, args?: IArgMap) {
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

