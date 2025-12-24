import { Module } from '@nestjs/common';
import { DeletedTeacherService } from './deleted-teacher.service';
import { DeletedTeacherController } from './deleted-teacher.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [DeletedTeacherController],
  providers: [DeletedTeacherService],
})
export class DeletedTeacherModule {}
