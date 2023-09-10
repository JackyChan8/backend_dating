import { Module } from '@nestjs/common';
import { DialogModule } from './dialog/dialog.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [DialogModule, MessageModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class ChatModule {}
