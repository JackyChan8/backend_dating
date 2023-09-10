import { Body, Controller, HttpException, HttpCode, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignInJwtDto, SignUpDto } from './dto/auth.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the user',
  })
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
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() body: SignInDto): Promise<SignInJwtDto | HttpException> {
    return await this.authService.signIn(body);
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @Post('refresh')
  async refresh() {
    await this.authService.refresh();
  }
}
