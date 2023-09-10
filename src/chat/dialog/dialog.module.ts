import { Module } from '@nestjs/common';

import { DialogService } from './dialog.service';
import { dialogProviders } from './dialog.providers';
import { DatabaseModule } from 'src/database/database.module';
import { DialogController } from './dialog.controller';

@Module({
  exports: [],
  imports: [DatabaseModule],
  controllers: [DialogController],
  providers: [...dialogProviders, DialogService],
})
export class DialogModule {}
