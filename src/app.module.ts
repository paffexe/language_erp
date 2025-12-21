import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TeacherModule } from './teacher/teacher.module';
import { TeacherPaymentModule } from './teacher-payment/teacher-payment.module';
import { TransactionModule } from './transaction/transaction.module';
import { StudentModule } from './student/student.module';
import { NotificationModule } from './notification/notification.module';
import { LessonTemplateModule } from './lesson-template/lesson-template.module';
import { LessonHistoryModule } from './lesson-history/lesson-history.module';
import { LessonModule } from './lesson/lesson.module';
import { DeletedTeacherModule } from './deleted-teacher/deleted-teacher.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    PrismaModule,
    TeacherModule,
    TeacherPaymentModule,
    TransactionModule,
    StudentModule,
    NotificationModule,
    LessonTemplateModule,
    LessonHistoryModule,
    LessonModule,
    DeletedTeacherModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
