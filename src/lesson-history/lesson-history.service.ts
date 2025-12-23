import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonHistoryDto } from './dto/create-lesson-history.dto';
import { UpdateLessonHistoryDto } from './dto/update-lesson-history.dto';

@Injectable()
export class LessonHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonHistoryDto) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: dto.teacherId },
      });
      if (!teacher || teacher.isDeleted) {
        throw new NotFoundException('Teacher not found or inactive');
      }

      const student = await this.prisma.student.findUnique({
        where: { id: dto.studentId },
      });
      if (!student || student.isDeleted) {
        throw new NotFoundException('Student not found or inactive');
      }

      const existingHistory = await this.prisma.lessonHistory.findFirst({
        where: {
          lessonId: dto.lessonId,
          teacherId: dto.teacherId,
          studentId: dto.studentId,
          isDeleted: false,
        },
      });

      if (existingHistory) {
        throw new BadRequestException(
          'Lesson history already exists for this teacher and student',
        );
      }

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
        statusCode: 201,
        message: 'Lesson history created successfully',
        history,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Lesson history creation failed');
    }
  }

  async findAll() {
    try {
      const [histories, count] = await this.prisma.$transaction([
        this.prisma.lessonHistory.findMany({
          where: { isDeleted: false },
          include: {
            lesson: true,
            teacher: true,
            student: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.lessonHistory.count({
          where: { isDeleted: false },
        }),
      ]);

      if (!count) {
        throw new NotFoundException('No lesson histories found');
      }

      return {
        statusCode: 200,
        message: 'Lesson histories retrieved successfully',
        count,
        histories,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error retrieving lesson histories:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve lesson histories',
      );
    }
  }

  async findOne(id: string) {
    try {
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
        statusCode: 200,
        message: 'Lesson history retrieved successfully',
        history,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Error retrieving lesson history with id ${id}:`, error);
      throw new InternalServerErrorException(
        'Failed to retrieve lesson history',
      );
    }
  }

  async update(id: string, dto: UpdateLessonHistoryDto) {
    try {
      const existingHistory = await this.prisma.lessonHistory.findFirst({
        where: { id, isDeleted: false },
      });

      if (!existingHistory) {
        throw new NotFoundException('Lesson history not found');
      }

      const teacherId = dto.teacherId ?? existingHistory.teacherId;
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: teacherId },
      });
      if (!teacher || teacher.isDeleted) {
        throw new NotFoundException('Teacher not found or inactive');
      }

      const studentId = dto.studentId ?? existingHistory.studentId;
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });
      if (!student || student.isDeleted) {
        throw new NotFoundException('Student not found or inactive');
      }

      const duplicate = await this.prisma.lessonHistory.findFirst({
        where: {
          id: { not: id },
          lessonId: dto.lessonId ?? existingHistory.lessonId,
          teacherId,
          studentId,
          isDeleted: false,
        },
      });
      if (duplicate) {
        throw new BadRequestException(
          'Duplicate lesson history exists for this teacher and student',
        );
      }

      const updatedHistory = await this.prisma.lessonHistory.update({
        where: { id },
        data: {
          ...dto,
          teacherId,
          studentId,
        },
      });

      return {
        statusCode: 200,
        message: 'Lesson history updated successfully',
        history: updatedHistory,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(`Error updating lesson history with id ${id}:`, error);
      throw new InternalServerErrorException('Lesson history update failed');
    }
  }

  async remove(id: string) {
    try {
      const history = await this.prisma.lessonHistory.findFirst({
        where: { id, isDeleted: false },
      });

      if (!history) {
        throw new NotFoundException(
          'Lesson history not found or already deleted',
        );
      }

      const dependentLesson = await this.prisma.lesson.findFirst({
        where: { id: history.lessonId, isDeleted: false },
      });

      if (dependentLesson) {
        throw new BadRequestException(
          'Cannot delete lesson history because the lesson exists',
        );
      }

      const deletedHistory = await this.prisma.lessonHistory.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return {
        statusCode: 200,
        message: 'Lesson history deleted successfully',
        history: deletedHistory,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(`Error deleting lesson history with id ${id}:`, error);
      throw new InternalServerErrorException('Lesson history deletion failed');
    }
  }
}
