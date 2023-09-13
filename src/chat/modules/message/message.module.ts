import { Module } from '@nestjs/common';

import { MessageService } from './message.service';
import { messageProviders } from './message.providers';
import { DialogModule } from '../dialog/dialog.module';

import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports: [MessageService],
  imports: [DatabaseModule, DialogModule, UsersModule],
  controllers: [],
  providers: [...messageProviders, MessageService],
})
export class MessageModule {}
