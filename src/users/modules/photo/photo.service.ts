import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Photos } from './models/photo.entity';
import { Users } from 'src/users/models/users.entity';

@Injectable()
export class PhotoService {
  constructor(
    @Inject('PHOTOS_REPOSITORY')
    private photosRepository: Repository<Photos>,
  ) {}

  async create(user: Users, filename: string): Promise<boolean> {
    // Insert Photo to Database
    const photo = await this.photosRepository
      .createQueryBuilder()
      .insert()
      .into(Photos)
      .values({
        user: user,
        filename: filename,
      })
      .execute();
    if (photo) {
      return true;
    } else {
      return false;
    }
  }

  async createMultiple(
    user: Users,
    filenames: Array<string>,
  ): Promise<boolean> {
    // Create Array Data to insert DB
    const data = [];
    for (let i = 0; i < filenames.length; i++) {
      data.push({ filename: filenames[i], user: user });
    }

    // Insert Photos to Database
    const photos = await this.photosRepository
      .createQueryBuilder()
      .insert()
      .into(Photos)
      .values(data)
      .execute();
    if (photos) {
      return true;
    } else {
      return false;
    }
  }
}
