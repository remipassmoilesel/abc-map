import { Injectable } from '@angular/core';
import {AuthenticationClient} from './AuthenticationClient';
import {IUserCreationRequest} from 'abcmap-shared';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private client: AuthenticationClient) { }

  public registerUser(request: IUserCreationRequest){
    return this.client.registerUser(request);
  }
}
