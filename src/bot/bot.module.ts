import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { RegistrationScene } from './bot.scene';
import { LessonModule } from '../lesson/lesson.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonHistoryModule } from '../lesson-history/lesson-history.module';

@Module({
  imports: [LessonModule, LessonHistoryModule, PrismaModule],
  controllers: [],
  providers: [BotService, BotUpdate, RegistrationScene],
})
export class BotModule {}
