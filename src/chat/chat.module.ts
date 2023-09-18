import { Module } from '@nestjs/common';

import { DialogModule } from './modules/dialog/dialog.module';
import { MessageModule } from './modules/message/message.module';
import { UsersModule } from 'src/users/users.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [DialogModule, MessageModule, UsersModule],
  exports: [],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
