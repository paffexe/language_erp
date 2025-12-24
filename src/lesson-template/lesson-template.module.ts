import { Module } from '@nestjs/common';
import { LessonTemplateService } from './lesson-template.service';
import { LessonTemplateController } from './lesson-template.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [LessonTemplateController],
  providers: [LessonTemplateService],
})
export class LessonTemplateModule {}
