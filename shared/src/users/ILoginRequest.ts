
export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  token: string;
}
