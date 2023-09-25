import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // Static Files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
    MailModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
