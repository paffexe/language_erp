import { Module } from '@nestjs/common';
import { TeacherPaymentService } from './teacher-payment.service';
import { TeacherPaymentController } from './teacher-payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [TeacherPaymentController],
  providers: [TeacherPaymentService],
})
export class TeacherPaymentModule {}
