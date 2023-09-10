export interface AuthInterface {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message: string;
}

export interface AuthSignInInterface {
  email: string;
  password: string;
  confirm_password: string;
}
