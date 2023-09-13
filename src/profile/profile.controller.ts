import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/profile.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Profile successfully created',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Profile already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while creating the user',
  })
  @ApiOperation({ summary: 'Create Profile' })
  @ApiBearerAuth('JWT-auth')
  @Post('create')
  async create(@Request() req: any, @Body() body: CreateProfileDto) {
    return this.profileService.create(body, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Profile' })
  @ApiBearerAuth('JWT-auth')
  @Post('update')
  async update() {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Profile' })
  @ApiBearerAuth('JWT-auth')
  @Get()
  async get() {}
}
