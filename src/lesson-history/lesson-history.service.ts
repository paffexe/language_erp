import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonHistoryDto } from './dto/create-lesson-history.dto';
import { UpdateLessonHistoryDto } from './dto/update-lesson-history.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LessonHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonHistoryDto) {
    try {
      // 1. Verify the lesson exists and hasn't been deleted
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: dto.lessonId },
      });

      if (!lesson || lesson.isDeleted) {
        throw new NotFoundException('Lesson not found or has been deleted');
      }

      // 2. Check if lesson has actually ended
      const now = new Date();
      if (lesson.endTime > now) {
        throw new BadRequestException(
          "Cannot create history for a lesson that hasn't ended yet",
        );
      }

      // 3. Verify teacher matches the lesson
      if (lesson.teacherId !== dto.teacherId) {
        throw new BadRequestException(
          "Teacher ID does not match the lesson's assigned teacher",
        );
      }

      // 4. Verify student matches the lesson
      if (lesson.studentId !== dto.studentId) {
        throw new BadRequestException(
          "Student ID does not match the lesson's assigned student",
        );
      }

      // 5. Check if teacher exists and is active
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: dto.teacherId },
      });
      if (!teacher || teacher.isDeleted) {
        throw new NotFoundException('Teacher not found or inactive');
      }

      // 6. Check if student exists and is active
      const student = await this.prisma.student.findUnique({
        where: { id: dto.studentId },
      });
      if (!student || student.isDeleted) {
        throw new NotFoundException('Student not found or inactive');
      }

      // 7. Check if history already exists for this lesson
      const existingHistory = await this.prisma.lessonHistory.findFirst({
        where: {
          lessonId: dto.lessonId,
          isDeleted: false,
        },
      });

      if (existingHistory) {
        throw new BadRequestException(
          'Lesson history already exists for this lesson',
        );
      }

      // 8. Validate star rating
      if (dto.star < 1 || dto.star > 5) {
        throw new BadRequestException('Star rating must be between 1 and 5');
      }

      // 9. Validate feedback length (optional but recommended)
      if (dto.feedback && dto.feedback.length > 1000) {
        throw new BadRequestException('Feedback cannot exceed 1000 characters');
      }

      // 10. Create the lesson history
      const history = await this.prisma.lessonHistory.create({
        data: {
          lessonId: dto.lessonId,
          star: dto.star,
          feedback: dto.feedback,
          teacherId: dto.teacherId,
          studentId: dto.studentId,
        },
        include: {
          lesson: {
            select: {
              id: true,
              name: true,
              startTime: true,
              endTime: true,
            },
          },
          teacher: {
            select: {
              id: true,
              fullName: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
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

      console.error('Error creating lesson history:', error);
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

  async getLessonsHistoryByStId(id: string) {
    const lessons = await this.prisma.lessonHistory.findMany({
      where: {
        studentId: id,
        isDeleted: false,
      },
      include: {
        teacher: true,
        lesson: true,
      },
    });

    if (!lessons.length) {
      return {
        message: "No lesson histroies so far",
        lessons
      }
    }

    return {
      message: 'Histrory retrieved successfully',
      lessons,
    };
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async autoCreateHistoryForCompletedLessons() {
    const now = new Date();

    const completedLessons = await this.prisma.lesson.findMany({
      where: {
        endTime: { lte: now },
        isDeleted: false,
        lessonHistories: {
          none: { isDeleted: false },
        },
      },
    });

    console.log(
      `[CRON] Found ${completedLessons.length} lessons without history`,
    );

    for (const lesson of completedLessons) {
      try {
        await this.prisma.lessonHistory.create({
          data: {
            lessonId: lesson.id,
            teacherId: lesson.teacherId,
            studentId: lesson.studentId,
            star: 0, // Default - teacher can update later
            feedback: 'Automatically created by system',
          },
        });
        console.log(`[CRON] Created history for lesson ${lesson.id}`);
      } catch (error) {
        console.error(`[CRON] Failed for lesson ${lesson.id}:`, error);
      }
    }
  }
}
