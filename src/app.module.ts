import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, UsersModule, MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
