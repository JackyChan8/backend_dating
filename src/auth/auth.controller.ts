import { Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp() {
    await this.authService.signUp();
  }

  @Post('sign-in')
  async signIn() {
    await this.authService.signIn();
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
