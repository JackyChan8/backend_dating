import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  imports: [],
  exports: [CatsService],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
