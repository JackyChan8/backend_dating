import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  imports: [DatabaseModule],
  controllers: [],
  providers: [...usersProviders, UsersService],
})
export class UsersModule {}
