import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

import { NotificationService } from './notification.service';
import { notifyProviders } from './notification.providers';
import { NotifyGateway } from './notification.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  exports: [NotificationService],
  providers: [...notifyProviders, NotificationService, NotifyGateway],
  controllers: [],
})
export class NotificationModule {}
