import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonHistoryDto } from './dto/create-lesson-history.dto';
import { UpdateLessonHistoryDto } from './dto/update-lesson-history.dto';

@Injectable()
export class LessonHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonHistoryDto) {
    const history = await this.prisma.lessonHistory.create({
      data: {
        lessonId: dto.lessonId,
        star: dto.star,
        feedback: dto.feedback,
        teacherId: dto.teacherId,
        studentId: dto.studentId,
      },
    });

    return {
      message: 'Lesson history created successfully',
      history,
    };
  }

  async findAll() {
    const histories = await this.prisma.lessonHistory.findMany({
      where: { isDeleted: false },
      include: {
        lesson: true,
        teacher: true,
        student: true,
      },
    });

    if (!histories.length) {
      throw new NotFoundException('No lesson histories found');
    }

    return {
      message: 'Lesson histories retrieved successfully',
      histories,
    };
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
      throw new NotFoundException('Lesson history not found');
    }

    return {
      message: 'Lesson history retrieved successfully',
      history,
    };
  }

  async update(id: string, dto: UpdateLessonHistoryDto) {
    await this.findOne(id);

    const updatedHistory = await this.prisma.lessonHistory.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Lesson history updated successfully',
      history: updatedHistory,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedHistory = await this.prisma.lessonHistory.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Lesson history deleted successfully',
      history: deletedHistory,
    };
  }
}
