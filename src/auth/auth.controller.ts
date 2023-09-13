import {
  Body,
  Controller,
  HttpException,
  HttpCode,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignInJwtDto, SignUpDto } from './dto/auth.dto';
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
  async signIn(@Body() body: SignInDto): Promise<SignInJwtDto | HttpException> {
    return await this.authService.signIn(body);
  }

  @ApiOperation({ summary: 'User Logout' })
  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @ApiOperation({ summary: 'User Refresh JWT Token' })
  @Post('refresh')
  async refresh() {
    await this.authService.refresh();
  }
}
