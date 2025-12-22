import { Module } from '@nestjs/common';
import { DeletedTeacherService } from './deleted-teacher.service';
import { DeletedTeacherController } from './deleted-teacher.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeletedTeacherController],
  providers: [DeletedTeacherService],
})
export class DeletedTeacherModule {}
