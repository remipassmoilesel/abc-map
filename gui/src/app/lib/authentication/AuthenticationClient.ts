import {ApiRoutes, IUserCreationRequest} from 'abcmap-shared';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// TODO: handle errors
@Injectable({
  providedIn: 'root'
})
export class AuthenticationClient {

  constructor(private httpClient: HttpClient) {

  }

  public registerUser(request: IUserCreationRequest): Observable<any> {
    const url = ApiRoutes.REGISTER.path;
    return this.httpClient.post<any>(url, request);
  }

}
