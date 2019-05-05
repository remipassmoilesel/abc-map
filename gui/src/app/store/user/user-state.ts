export interface IUserState {
  loggedIn: boolean;
  username: string;
  token: string;
}

export const userState: IUserState = {
  loggedIn: false,
  username: '',
  token: '',
};
