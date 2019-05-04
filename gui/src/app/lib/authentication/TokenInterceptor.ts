import {AuthenticationService} from './authentication.service';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authentication: AuthenticationService) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authentication.getToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authentication.getToken()}`
        }
      });
    }

    return next.handle(request);
  }

}
