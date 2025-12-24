import { Module } from '@nestjs/common';
import { LessonHistoryService } from './lesson-history.service';
import { LessonHistoryController } from './lesson-history.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [LessonHistoryController],
  providers: [LessonHistoryService],
  exports: [LessonHistoryService],
})
export class LessonHistoryModule {}
