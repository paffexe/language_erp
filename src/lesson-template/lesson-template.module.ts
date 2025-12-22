import { Module } from '@nestjs/common';
import { LessonTemplateService } from './lesson-template.service';
import { LessonTemplateController } from './lesson-template.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LessonTemplateController],
  providers: [LessonTemplateService, PrismaService],
})
export class LessonTemplateModule {}
