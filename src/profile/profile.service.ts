import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UsersService } from 'src/users/users.service';

import { Profiles } from './models/profile.entity';
import {
  ProfileCreateInterface,
  ProfileResInterface,
  ProfileUpdateInterface,
} from './interfaces/profile.interface';

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

  async findOne(userID: number): Promise<ProfileResInterface> {
    const profile = await this.profileRepository.findOneBy({
      user: { id: userID },
    });
    if (!profile) {
      throw new HttpException('Profile does not exist', 404);
    }
    return {
      status: 200,
      message: 'Profile received successfully',
      data: profile,
    };
  }

  async update(data: ProfileUpdateInterface, userID: number) {
    // Check Exist Profile
    const existProfile = await this.checkExist(userID);
    if (existProfile) {
      // Update Profile
      const profile = await this.profileRepository
        .createQueryBuilder()
        .update(Profiles)
        .set(data)
        .where({ user: userID })
        .execute();
      if (profile.affected) {
        throw new HttpException('Profile successfully update', 200);
      } else {
        throw new HttpException(
          'An error occurred while updating the profile',
          500,
        );
      }
    } else {
      throw new HttpException('Profile does not exist', 204);
    }
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
            interests: data.interests,
            character: data.character,
            familyStatus: data.familyStatus,
            orientation: data.orientation,
            looking: data.looking,
            qualities: data.qualities,
            partnerDesc: data.partnerDesc,
          })
          .execute();
        if (profile) {
          // Update Field profile in User Model
          const isUpdate = await this.usersService.update(
            userID,
            profile.raw[0],
          );
          if (!isUpdate) {
            throw new HttpException(
              'An error occurred while updating user',
              500,
            );
          }
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
