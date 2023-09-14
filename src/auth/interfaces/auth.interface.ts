export interface AuthInterface {
  email: string;
  password: string;
  confirm_password: string;
}

export interface AuthSignInInterface {
  email: string;
  password: string;
}

export interface AuthSignInJwt {
  statusCode: number;
  access_token: string;
}
