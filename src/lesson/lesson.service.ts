import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
      const startTime = new Date(dto.startTime);
      const endTime = new Date(dto.endTime);

      // 1️⃣ vaqt validatsiyasi
      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      // 2️⃣ teacher mavjudligi
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: dto.teacherId },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      // 3️⃣ student mavjudligi
      const student = await this.prisma.student.findUnique({
        where: { id: dto.studentId },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // 4️⃣ teacher overlap
      const teacherBusy = await this.prisma.lesson.findFirst({
        where: {
          teacherId: dto.teacherId,
          isDeleted: false,
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (teacherBusy) {
        throw new BadRequestException('Teacher is busy at this time');
      }

      // 5️⃣ student overlap
      const studentBusy = await this.prisma.lesson.findFirst({
        where: {
          studentId: dto.studentId,
          isDeleted: false,
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (studentBusy) {
        throw new BadRequestException(
          'Student already has a lesson at this time',
        );
      }

      // 6️⃣ googleMeetsUrl unique
      const urlExists = await this.prisma.lesson.findUnique({
        where: { googleMeetsUrl: dto.googleMeetsUrl },
      });

      if (urlExists) {
        throw new BadRequestException('Google Meets URL already exists');
      }

      // 7️⃣ create
      const lesson = await this.prisma.lesson.create({
        data: {
          name: dto.name,
          startTime,
          endTime,
          teacherId: dto.teacherId,
          studentId: dto.studentId,
          googleMeetsUrl: dto.googleMeetsUrl,
          price: dto.price,
          isPaid: dto.isPaid ?? false,
        },
      });

      return {
        statusCode: 201,
        message: 'Lesson created successfully',
        lesson,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Lesson creation failed');
    }
  }

  async findAll() {
    try {
      const [lessons, count] = await this.prisma.$transaction([
        this.prisma.lesson.findMany({
          where: { isDeleted: false },
          include: {
            teacher: true,
            student: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.lesson.count({
          where: { isDeleted: false },
        }),
      ]);

      if (!count) {
        throw new NotFoundException('No lessons found');
      }

      return {
        statusCode: 200,
        message: 'Lessons retrieved successfully',
        count,
        lessons,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Lessons retrieval failed');
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
        throw new NotFoundException('Lesson not found');
      }

      return {
        statusCode: 200,
        message: 'Lesson retrieved successfully',
        lesson,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Lesson retrieval failed');
    }
  }

  async update(id: string, dto: UpdateLessonDto) {
    try {
      const existingLesson = await this.prisma.lesson.findFirst({
        where: { id, isDeleted: false },
      });

      if (!existingLesson) {
        throw new NotFoundException('Lesson not found');
      }

      const startTime = dto.startTime
        ? new Date(dto.startTime)
        : existingLesson.startTime;

      const endTime = dto.endTime
        ? new Date(dto.endTime)
        : existingLesson.endTime;

      // 1️⃣ vaqt validatsiyasi
      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      const teacherId = dto.teacherId ?? existingLesson.teacherId;
      const studentId = dto.studentId ?? existingLesson.studentId;

      // 2️⃣ teacher overlap (o‘zini hisobga olmasdan)
      const teacherBusy = await this.prisma.lesson.findFirst({
        where: {
          id: { not: id },
          teacherId,
          isDeleted: false,
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (teacherBusy) {
        throw new BadRequestException('Teacher is busy at this time');
      }

      // 3️⃣ student overlap
      const studentBusy = await this.prisma.lesson.findFirst({
        where: {
          id: { not: id },
          studentId,
          isDeleted: false,
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (studentBusy) {
        throw new BadRequestException(
          'Student already has a lesson at this time',
        );
      }

      // 4️⃣ googleMeetsUrl unique (agar o‘zgargan bo‘lsa)
      if (
        dto.googleMeetsUrl &&
        dto.googleMeetsUrl !== existingLesson.googleMeetsUrl
      ) {
        const urlExists = await this.prisma.lesson.findUnique({
          where: { googleMeetsUrl: dto.googleMeetsUrl },
        });

        if (urlExists) {
          throw new BadRequestException('Google Meets URL already exists');
        }
      }

      // 5️⃣ UPDATE
      const updatedLesson = await this.prisma.lesson.update({
        where: { id },
        data: {
          ...dto,
          startTime,
          endTime,
        },
      });

      return {
        message: 'Lesson updated successfully',
        lesson: updatedLesson,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.log(error)
      throw new BadRequestException('Lesson update failed');
    }
  }

  async remove(id: string) {
    try {
      const lesson = await this.prisma.lesson.findFirst({
        where: { id, isDeleted: false },
      });

      if (!lesson) {
        throw new NotFoundException('Lesson not found or already deleted');
      }

      // 🔒 OPTIONAL BUSINESS RULE:
      // Agar dars boshlangan bo‘lsa o‘chirmaymiz
      if (lesson.startTime <= new Date()) {
        throw new BadRequestException('Started lesson cannot be deleted');
      }

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
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Lesson deletion failed');
    }
  }
}
