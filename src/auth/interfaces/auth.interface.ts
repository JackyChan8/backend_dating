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
  refresh_token: string;
}

export interface AuthAddRefreshToken {
  userId: number;
  refreshToken: string;
  expiresAt: string | null;
}

export interface AuthRefresh {
  statusCode: number;
  access_token: string;
  refresh_token: string;
}

export interface AuthGenerateTokens {
  access_token: string;
  refresh_token: string;
}
