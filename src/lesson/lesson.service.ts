import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { google } from 'googleapis';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  /// generating google meet link
  private async generateGoogleMeetLink(
    teacher: any,
    startTime: Date,
    endTime: Date,
    lessonName: string,
  ): Promise<{ hangoutLink: string; eventId: string }> {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
    );

    oauth2Client.setCredentials({
      access_token: teacher.googleAccessToken,
      refresh_token: teacher.googleRefreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: lessonName,
      description: `Lesson managed by your platform`,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
      conferenceData: {
        createRequest: {
          requestId: `lesson-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
      });

      return {
        hangoutLink: response.data.hangoutLink!,
        eventId: response.data.id!,
      };
    } catch (error) {
      console.error('Google Calendar API Error:', error);
      throw new InternalServerErrorException(
        'Failed to create Google Meet link',
      );
    }
  }

  async create(dto: CreateLessonDto) {
    try {
      // date time logic check start
      const startTime = new Date(dto.startTime);
      const endTime = new Date(dto.endTime);
      const now = new Date();

      // 2. Check if start time is in the past
      if (startTime.getTime() <= now.getTime()) {
        throw new BadRequestException(
          `Start time must be in the future. Current time: ${now.toISOString()}, Your start time: ${startTime.toISOString()}`,
        );
      }

      // 3. Check if end datetime is in the past
      if (endTime.getTime() <= now.getTime()) {
        throw new BadRequestException(
          `End time must be in the future. Current time: ${now.toISOString()}, Your end time: ${endTime.toISOString()}`,
        );
      }

      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      const findTeacher = await this.prisma.teacher.findUnique({
        where: { id: dto.teacherId },
      });
      if (!findTeacher) {
        throw new NotFoundException('Teacher not found');
      }

      // const student = await this.prisma.student.findUnique({
      //   where: { id: dto.studentId },
      // });
      // if (!student) {
      //   throw new NotFoundException('Student not found');
      // }

      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);
      const ALLOWED_DURATIONS_MINUTES = [30, 45, 60, 90, 120];

      if (!ALLOWED_DURATIONS_MINUTES.includes(durationMinutes)) {
        throw new BadRequestException(
          `Invalid lesson duration. Allowed durations: ${ALLOWED_DURATIONS_MINUTES.join(', ')} minutes`,
        );
      }

      // date time logic check end

      const teacher = await this.prisma.teacher.findUnique({
        where: { id: dto.teacherId },
      });
      if (!teacher) throw new NotFoundException('Teacher not found');

      // Check if teacher has linked Google
      if (!teacher.googleAccessToken) {
        throw new BadRequestException(
          'Teacher must connect Google account to create lessons',
        );
      }

      // Add 15-minute break buffer to the end time for checking conflicts
      const BREAK_TIME_MINUTES = 15;
      const endTimeWithBreak = new Date(
        endTime.getTime() + BREAK_TIME_MINUTES * 60 * 1000,
      );

      // Check if teacher is busy (including 15-minute break after their lessons)
      const teacherBusy = await this.prisma.lesson.findFirst({
        where: {
          teacherId: dto.teacherId,
          isDeleted: false,
          OR: [
            {
              // Check if new lesson overlaps with existing lesson
              startTime: { lt: endTime },
              endTime: { gt: startTime },
            },
            {
              // Check if new lesson starts during another lesson's break time
              startTime: { lt: endTimeWithBreak },
              endTime: { gt: startTime },
            },
          ],
        },
      });

      if (teacherBusy) {
        throw new BadRequestException(
          'Teacher is busy at this time or within the 15-minute break period',
        );
      }

      // Check if the new lesson starts too soon after teacher's previous lesson
      const previousTeacherLesson = await this.prisma.lesson.findFirst({
        where: {
          teacherId: dto.teacherId,
          isDeleted: false,
          endTime: {
            gt: new Date(startTime.getTime() - BREAK_TIME_MINUTES * 60 * 1000),
            lte: startTime,
          },
        },
      });

      if (previousTeacherLesson) {
        throw new BadRequestException(
          'Teacher needs a 15-minute break after the previous lesson',
        );
      }

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

      // GENERATE GOOGLE MEET LINK

      const generatedMeetsUrl = await this.generateGoogleMeetLink(
        teacher,
        startTime,
        endTime,
        dto.name,
      );

      // 4. SAVE TO DB

      const lesson = await this.prisma.lesson.create({
        data: {
          name: dto.name,
          startTime,
          endTime,
          teacherId: dto.teacherId,
          googleMeetsUrl: generatedMeetsUrl.hangoutLink,
          googleEventId: generatedMeetsUrl.eventId,
          price: dto.price,
          isPaid: dto.isPaid ?? false,
        },
      });

      return {
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
      console.log(error);
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

      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      const teacherId = dto.teacherId ?? existingLesson.teacherId;
      const studentId = dto.studentId ?? existingLesson.studentId;

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
      console.log(error);
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

  async findAllbyStudent(studentId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { studentId, isDeleted: false },
      include: {
        teacher: true,
      },
    });

    if (!lessons.length) {
      return {
        message: 'No lessons found for this student',
        lessons: [],
      };
    }
    return {
      message: 'Lessons retrieved successfully',
      lessons,
    };
  }

  async findAllbyTeacher(teacherId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { teacherId, isDeleted: false },
      // include: { student: true },
    });

    if (!lessons.length) {
      // throw new NotFoundException('No lessons found for this teacher');
      return {
        message: 'No lessons found for this teacher',
        lessons: [],
      };
    }

    return {
      message: 'Lessons retrieved successfully',
      lessons,
    };
  }
}
