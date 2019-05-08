import {IResponse} from '../http';

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse extends IResponse {
  message: string;
  username: string;
  token: string;
}
