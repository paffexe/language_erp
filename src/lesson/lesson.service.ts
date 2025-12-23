import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    const lesson = await this.prisma.lesson.create({
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

    return {
      message: 'Lesson created successfully',
      lesson,
    };
  }

  async findAll() {
    const lessons = await this.prisma.lesson.findMany({
      where: { isDeleted: false },
      include: {
        teacher: true,
        student: true,
      },
    });

    if (!lessons.length) {
      throw new NotFoundException('No lessons found');
    }

    return {
      message: 'Lessons retrieved successfully',
      lessons,
    };
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: {
        teacher: true,
        student: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return {
      message: 'Lesson retrieved successfully',
      lesson,
    };
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.findOne(id);

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      },
    });

    return {
      message: 'Lesson updated successfully',
      lesson: updatedLesson,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Lesson deleted successfully',
      lesson: deletedLesson,
    };
  }
}
