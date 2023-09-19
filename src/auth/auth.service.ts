import { Injectable, HttpException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { UsersService } from 'src/users/users.service';

import {
  AuthAddRefreshToken,
  AuthGenerateTokens,
  AuthInterface,
  AuthRefresh,
  AuthSignInInterface,
  AuthSignInJwt,
} from './interfaces/auth.interface';

import { hashPassword, checkPassword } from 'src/utils/bcrypt/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

import db from '../db';

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
          const resSendActivationMail = this.mailService.sendActivationMail({
            to: data.email,
            link: 'https://google.com/',
          });
          if (!resSendActivationMail) {
            throw new HttpException(
              'The user has successfully registered, but no confirmation message has been sent.',
              500,
            );
          }
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

  async signIn(data: AuthSignInInterface): Promise<AuthSignInJwt> {
    const user = await this.usersService.findOne(data.email);
    if (user) {
      const checkRes = await checkPassword(data.password, user.password);
      if (!checkRes) {
        throw new HttpException('Wrong email or password', 401);
      } else {
        const { access_token, refresh_token } = await this.generateTokens(
          user.id,
          user.email,
        );
        if (access_token.length === 0 || refresh_token.length === 0) {
          throw new HttpException('Error in generateTokens', 500);
        }

        return {
          statusCode: 200,
          access_token,
          refresh_token,
        };
      }
    } else {
      throw new HttpException('User with this email does not exist', 404);
    }
  }

  async generateTokens(
    userId: number,
    email: string,
  ): Promise<AuthGenerateTokens> {
    const payload = { sub: userId, email: email };
    const accessToken: string = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });
    const refreshToken: string = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    const resAddRefreshToken = await this.addRefreshToken({
      userId: userId,
      refreshToken: refreshToken,
      expiresAt: DateTime.now().plus({ days: 7 }).toISO(),
    });
    if (!resAddRefreshToken) {
      throw new HttpException('Error in addRefreshToken', 500);
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async getUserByRefreshToken(refreshToken: string) {
    const authRefreshGetUser = await db.query(
      'SELECT auth_refresh_get_user($1)',
      [refreshToken],
    );
    if (authRefreshGetUser.rows.length === 0) {
      throw new HttpException('Error in getUserByRefreshToken', 500);
    }
    return authRefreshGetUser.rows[0].auth_refresh_get_user;
  }

  async addRefreshToken(data: AuthAddRefreshToken): Promise<boolean> {
    const refreshTokenAdd = await db.query(
      'SELECT auth_refresh_token_add($1, $2, $3)',
      [data.userId, data.refreshToken, data.expiresAt],
    );
    return refreshTokenAdd.rows[0].auth_refresh_token_add;
  }

  async refresh(refreshTokenOld: string): Promise<AuthRefresh> {
    const resGetUserByRefreshToken =
      await this.getUserByRefreshToken(refreshTokenOld);

    const { access_token, refresh_token } = await this.generateTokens(
      resGetUserByRefreshToken[0].id,
      resGetUserByRefreshToken[0].email,
    );
    if (access_token.length === 0 || refresh_token.length === 0) {
      throw new HttpException('Error in generateTokens', 500);
    }

    return {
      statusCode: 200,
      access_token,
      refresh_token,
    };
  }
}
