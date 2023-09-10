import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import { AuthInterface, AuthSignUpRes } from './interfaces/auth.interface';

import { hashPassword } from 'src/utils/bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(data: AuthInterface): Promise<AuthSignUpRes> {
    const checkExist = await this.usersService.checkExistUser(data.email);
    if (!checkExist) {
      // Hash Password
      const hashedPassword = await hashPassword(data.password);
      // Create Model
      const user = await this.usersService.create(data.email, hashedPassword);
      if (user) {
        return { status: 201, message: 'Success create user' };
      } else {
        return {
          status: 500,
          message: 'An error occurred while creating the user',
        };
      }
    } else {
      return { status: 409, message: 'User with this email already exists' };
    }
  }

  async signIn() {}

  async logout() {}

  async refresh() {}
}
