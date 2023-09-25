import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { ProfileService } from './profile.service';
import { profileProviders } from './profile.providers';
import { ProfileController } from './profile.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports: [ProfileService],
  imports: [DatabaseModule, UsersModule],
  controllers: [ProfileController],
  providers: [...profileProviders, ProfileService],
})
export class ProfileModule {}
