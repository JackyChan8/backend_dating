import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import {
  AuthInterface,
  AuthSignInInterface,
  AuthResponse,
} from './interfaces/auth.interface';

import { hashPassword, checkPassword } from 'src/utils/bcrypt/bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(data: AuthInterface): Promise<AuthResponse> {
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

  async signIn(data: AuthSignInInterface): Promise<AuthResponse> {
    // Check Exist User
    const user = await this.usersService.findOne(data.email);
    if (user) {
      // Check Passwords
      const checkRes = await checkPassword(
        data.password,
        data.confirm_password,
        user.password,
      );
      if (!checkRes) {
        return { status: 401, message: 'Wrong email or password' };
      } else {
        // Generate JWT
        return { status: 200, message: '111' };
      }
    } else {
      return { status: 404, message: 'User with this email does not exist' };
    }
  }

  async logout() {}

  async refresh() {}
}
