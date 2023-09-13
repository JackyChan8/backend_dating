import { Injectable, HttpException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import {
  AuthInterface,
  AuthSignInInterface,
  AuthSignInJwt,
} from './interfaces/auth.interface';

import { hashPassword, checkPassword } from 'src/utils/bcrypt/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(data: AuthInterface): Promise<HttpException> {
    const checkExist = await this.usersService.checkExistUser(data.email);
    if (!checkExist) {
      // Check Passwords
      const checkPass = data.password === data.confirm_password;
      if (checkPass) {
        // Hash Password
        const hashedPassword = await hashPassword(data.password);
        // Create Model
        const user = await this.usersService.create(data.email, hashedPassword);
        if (user) {
          // Send Mail
          // const resMail = await this.mailService.sendActivationMail({
          //   link: 'https://google.com/',
          //   to: data.email,
          // });
          // if (!resMail) {
          //   throw new HttpException(
          //     'The user has successfully registered, but no confirmation message has been sent.',
          //     200,
          //   );
          // }
          throw new HttpException('User successfully registered.', 201);
        } else {
          throw new HttpException(
            'An error occurred while creating the user',
            500,
          );
        }
      } else {
        throw new HttpException('Passwords are not the same', 401);
      }
    } else {
      throw new HttpException('User with this email already exists', 409);
    }
  }

  async signIn(
    data: AuthSignInInterface,
  ): Promise<AuthSignInJwt | HttpException> {
    // Check Exist User
    const user = await this.usersService.findOne(data.email);
    if (user) {
      // Check Passwords
      const checkRes = await checkPassword(data.password, user.password);
      if (!checkRes) {
        throw new HttpException('Wrong email or password', 401);
      } else {
        // Generate JWT
        const payload = { sub: user.id, email: user.email };
        return { access_token: await this.jwtService.signAsync(payload) };
      }
    } else {
      throw new HttpException('User with this email does not exist', 404);
    }
  }

  async logout() {}

  async refresh() {}
}
