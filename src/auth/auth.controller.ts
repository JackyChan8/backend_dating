import { Body, Controller, HttpException, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
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
    const res = await this.authService.signUp(body);
    throw new HttpException(res.message, res.status);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDto): Promise<HttpException> {
    const res = await this.authService.signIn(body);
    throw new HttpException(res.message, res.status);
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
