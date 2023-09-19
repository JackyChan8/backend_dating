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
}
