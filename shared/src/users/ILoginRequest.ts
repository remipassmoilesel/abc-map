
export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  username: string;
  token: string;
}
