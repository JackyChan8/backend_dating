import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { signUpDto } from './dto/signup-users.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
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
  async signUp(@Body() body: signUpDto): Promise<HttpException> {
    const res = await this.usersService.register(body);
    throw new HttpException(res.message, res.status);
  }
}
