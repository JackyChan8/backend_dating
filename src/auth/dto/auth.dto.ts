export class SignUpDto {
  email: string;
  password: string;
}

export class SignInDto {
  email: string;
  password: string;
  confirm_password: string;
}

export class SignInJwtDto {
  access_token: string;
}
