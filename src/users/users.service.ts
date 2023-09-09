import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './models/users.entity';
import {
  UsersInterface,
  UsersSignUpResponse,
} from './interfaces/users.interface';

import { hashPassword } from 'src/utils/bcrypt/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async checkExistUser(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async register(data: UsersInterface): Promise<UsersSignUpResponse> {
    const checkExist = await this.checkExistUser(data.email);
    if (!checkExist) {
      // Hash Password
      const hashedPassword = await hashPassword(data.password);
      // Create Model
      const user = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values({
          email: data.email,
          password: hashedPassword,
        })
        .execute();
      if (user) {
        return { status: 201, message: 'Success create user' };
      } else {
        return {
          status: 500,
          message: 'An error occurred while creating the user',
        };
      }
    } else {
      return { status: 409, message: 'User with this email already exists' };
    }
  }
}
