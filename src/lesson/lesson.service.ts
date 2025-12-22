import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    try {
      return await this.prisma.lesson.create({
        data: {
          name: dto.name,
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          teacherId: dto.teacherId,
          studentId: dto.studentId,
          googleMeetsUrl: dto.googleMeetsUrl,
          price: dto.price,
          isPaid: dto.isPaid ?? false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Lesson yaratishda xatolik');
    }
  }

  async findAll() {
    try {
      return await this.prisma.lesson.findMany({
        where: { isDeleted: false },
        include: {
          teacher: true,
          student: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Lessonlar olinmadi');
    }
  }

  async findOne(id: string) {
    try {
      const lesson = await this.prisma.lesson.findFirst({
        where: { id, isDeleted: false },
        include: {
          teacher: true,
          student: true,
        },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson topilmadi');
      }

      return lesson;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateLessonDto) {
    try {
      await this.findOne(id); // mavjudligini tekshiradi

      return await this.prisma.lesson.update({
        where: { id },
        data: {
          ...dto,
          startTime: dto.startTime ? new Date(dto.startTime) : undefined,
          endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.lesson.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
