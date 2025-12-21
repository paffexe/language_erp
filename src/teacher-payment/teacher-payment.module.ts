import { Module } from '@nestjs/common';
import { TeacherPaymentService } from './teacher-payment.service';
import { TeacherPaymentController } from './teacher-payment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherPaymentController],
  providers: [TeacherPaymentService],
})
export class TeacherPaymentModule {}
