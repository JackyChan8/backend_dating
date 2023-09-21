import { Module } from '@nestjs/common';

import { DialogModule } from './modules/dialog/dialog.module';
import { MessageModule } from './modules/message/message.module';
import { UsersModule } from 'src/users/users.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DialogModule, MessageModule, UsersModule, AuthModule],
  exports: [],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
