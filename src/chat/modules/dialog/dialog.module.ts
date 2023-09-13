import { Module } from '@nestjs/common';

import { DialogService } from './dialog.service';
import { dialogProviders } from './dialog.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports: [DialogService],
  imports: [DatabaseModule, UsersModule],
  controllers: [],
  providers: [...dialogProviders, DialogService],
})
export class DialogModule {}
