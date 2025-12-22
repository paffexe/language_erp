import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonHistoryDto } from './dto/create-lesson-history.dto';
import { UpdateLessonHistoryDto } from './dto/update-lesson-history.dto';

@Injectable()
export class LessonHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonHistoryDto) {
    try {
      return await this.prisma.lessonHistory.create({
        data: {
          lessonId: dto.lessonId,
          star: dto.star,
          feedback: dto.feedback,
          teacherId: dto.teacherId,
          studentId: dto.studentId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson history yaratishda xatolik',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.lessonHistory.findMany({
        where: { isDeleted: false },
        include: {
          lesson: true,
          teacher: true,
          student: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson historylar olinmadi',
      );
    }
  }

  async findOne(id: string) {
    const history = await this.prisma.lessonHistory.findFirst({
      where: { id, isDeleted: false },
      include: {
        lesson: true,
        teacher: true,
        student: true,
      },
    });

    if (!history) {
      throw new NotFoundException('Lesson history topilmadi');
    }

    return history;
  }

  async update(id: string, dto: UpdateLessonHistoryDto) {
    await this.findOne(id);

    try {
      return await this.prisma.lessonHistory.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson history yangilanmadi',
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.lessonHistory.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson history o‘chirilmadi',
      );
    }
  }
}
