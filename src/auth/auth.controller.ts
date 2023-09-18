import {
  Body,
  Controller,
  HttpException,
  HttpCode,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import {
  RefreshDto,
  SignInDto,
  SignInJwtDto,
  SignOutDto,
  SignUpDto,
} from './dto/auth.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: 401,
    description: 'Passwords are not the same',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the user',
  })
  @ApiOperation({ summary: 'User Registration' })
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto): Promise<HttpException> {
    return await this.authService.signUp(body);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has successfully authenticated',
  })
  @ApiResponse({
    status: 401,
    description: 'Wrong email or password',
  })
  @ApiResponse({
    status: 404,
    description: 'User with this email does not exist',
  })
  @ApiOperation({ summary: 'User Authorization' })
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignInJwtDto> {
    const resSignIn = await this.authService.signIn(body);
    response.cookie('refresh-token', resSignIn.refresh_token, {
      maxAge: 3600 * 24 * 7,
      path: '/',
      secure: false,
      httpOnly: true,
    });
    return {
      statusCode: resSignIn.statusCode,
      access_token: resSignIn.access_token,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The user has successfully sign out',
  })
  @ApiOperation({ summary: 'User Sign Out' })
  @Post('sign-out')
  async signOut(
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignOutDto> {
    response.cookie('refresh-token', '', {
      maxAge: -1,
      path: '/',
      secure: false,
      httpOnly: true,
    });
    return {
      statusCode: 200,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The user has successfully refresh token',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while refresh tokens',
  })
  @ApiOperation({ summary: 'User Refresh JWT Token' })
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshDto> {
    const refreshToken: string = request.cookies['refresh-token'];
    if (refreshToken.length === 0) {
      throw new HttpException('Token refresh is empty', 500);
    }
    const resRefresh = await this.authService.refresh(refreshToken);
    response.cookie('refresh-token', resRefresh.refresh_token, {
      maxAge: 3600 * 24 * 7,
      path: '/',
      secure: false,
      httpOnly: true,
    });

    return {
      statusCode: resRefresh.statusCode,
      access_token: resRefresh.access_token,
    };
  }
}
