import { Module } from '@nestjs/common';
import { LessonHistoryService } from './lesson-history.service';
import { LessonHistoryController } from './lesson-history.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LessonHistoryController],
  providers: [LessonHistoryService, PrismaService],
})
export class LessonHistoryModule {}
