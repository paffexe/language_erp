import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    PrismaModule,
    LessonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule { }
