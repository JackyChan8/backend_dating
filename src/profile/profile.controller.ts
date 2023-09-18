import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import {
  CreateProfileDto,
  ProfileResDto,
  UpdateProfileDto,
} from './dto/profile.dto';

import { AuthGuard } from 'src/auth/auth.guard';

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
  @ApiResponse({
    status: 200,
    description: 'Profile successfully update',
  })
  @ApiResponse({
    status: 204,
    description: 'Profile does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while updating the profile',
  })
  @ApiOperation({ summary: 'Update Profile' })
  @ApiBearerAuth('JWT-auth')
  @Put('update')
  async update(@Request() req: any, @Body() body: UpdateProfileDto) {
    return await this.profileService.update(body, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Profile received successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile does not exist',
  })
  @ApiOperation({ summary: 'Get Profile' })
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async get(@Param('id') userID: number): Promise<ProfileResDto> {
    return await this.profileService.findOne(userID);
  }
}
