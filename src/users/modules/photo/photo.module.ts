import { Module } from '@nestjs/common';
import { photoProviders } from './photo.providers';
import { PhotoService } from './photo.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  exports: [PhotoService],
  imports: [DatabaseModule],
  controllers: [],
  providers: [...photoProviders, PhotoService],
})
export class PhotoModule {}
