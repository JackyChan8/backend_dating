import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { DialogModule } from './modules/dialog/dialog.module';
import { MessageModule } from './modules/message/message.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { NotificationModule } from 'src/notification/notification.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    DialogModule,
    MessageModule,
    UsersModule,
    AuthModule,
    NotificationModule,
    ProfileModule,
  ],
  exports: [],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
