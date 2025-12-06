import { IUser } from "./user.type";

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  user: IUser;
}

export interface ILogoutResponse {
  message: string;
  success: boolean;
}

export interface IRegisterResponse {
  id: string;
  username: string;
  email: string | null;
  name: string;
}
