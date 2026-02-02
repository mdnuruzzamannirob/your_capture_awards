export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  role: string;
  phone: number;
  avatar: string;
  cover: string;
  location: string;
}

export type SigninData = {
  email: string;
  password: string;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export interface AuthState {
  tempToken: string | null;
  tempEmail: string | null;
}
