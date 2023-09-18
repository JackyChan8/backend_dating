import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule, UsersModule, ProfileModule, MailModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
