import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Profiles } from './models/profile.entity';
import { ProfileCreateInterface } from './interfaces/profile.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('PROFILES_REPOSITORY')
    private profileRepository: Repository<Profiles>,
    private usersService: UsersService,
  ) {}

  async checkExist(userID: number): Promise<boolean> {
    return await this.profileRepository.exist({
      where: { user: { id: userID } },
    });
  }

  async create(data: ProfileCreateInterface, userID: number) {
    // Check Exist Profile
    const checkProfile = await this.checkExist(userID);
    if (checkProfile) {
      throw new HttpException('Profile already exists', 409);
    } else {
      // Get User
      const user = await this.usersService.findByID(userID);
      if (user) {
        // Create Profile
        const profile = await this.profileRepository
          .createQueryBuilder()
          .insert()
          .into(Profiles)
          .values({
            firstName: data.firstName,
            user: user,
            birthday: data.birthday,
            sex: data.sex,
            height: data.height,
            weight: data.weight,
            bodyBuild: data.bodyBuild,
            eyeColor: data.eyeColor,
            aboutMe: data.aboutMe,
            character: data.character,
            familyStatus: data.familyStatus,
            orientation: data.orientation,
          })
          .execute();
        if (profile) {
          throw new HttpException('Profile successfully created', 200);
        } else {
          throw new HttpException(
            'An error occurred while creating the user',
            500,
          );
        }
      } else {
        throw new HttpException('Unauthorized', 401);
      }
    }
  }
}
