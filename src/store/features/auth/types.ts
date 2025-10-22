export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  role: string;
  phone: number;
  avatar: string;
  cover: string;
  location: string | null;
}

export type TSigninData = {
  email: string;
  password: string;
};

export type TSignupData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export interface IAuthState {
  token: string | null;
  user: IUser | null;
}
