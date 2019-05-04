import {ApiRoutes, ILoginRequest, ILoginResponse, IUserCreationRequest} from 'abcmap-shared';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationClient {

  constructor(private httpClient: HttpClient) {

  }

  public registerUser(request: IUserCreationRequest): Observable<void> {
    return this.httpClient.post<void>(ApiRoutes.REGISTER.path, request);
  }

  public login(request: ILoginRequest) {
    return this.httpClient.post<ILoginResponse>(ApiRoutes.LOGIN.path, request);
  }
}
