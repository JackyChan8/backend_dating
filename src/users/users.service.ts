import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Users } from './models/users.entity';
import { Profiles } from 'src/profile/models/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<Users>,
  ) {}

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

  async create(email: string, hash_password: string): Promise<boolean> {
    const user = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values({
        email: email,
        password: hash_password,
      })
      .execute();
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async update(userID: number, profile: Profiles): Promise<boolean> {
    const isUpdate = (
      await this.usersRepository.update(
        { id: userID },
        {
          profile: profile,
        },
      )
    ).affected;
    if (isUpdate) {
      return true;
    } else {
      return false;
    }
  }

  async findOne(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({
      email: email,
    });
  }

  async findByID(userId: number): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
}
