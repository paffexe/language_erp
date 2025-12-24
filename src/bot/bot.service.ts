import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LessonService } from '../lesson/lesson.service';
import { LessonHistoryService } from '../lesson-history/lesson-history.service';

@Injectable()
export class BotService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lessonService: LessonService,
    private readonly histroryService: LessonHistoryService,
  ) {}

  async registerStudent(dto: TelegramUserDto) {
    const { tgId, firstName, lastName, tgUsername, phoneNumber } = dto;

    // Create new student
    return this.prismaService.student.create({
      data: {
        tgId: tgId.toString(),
        firstName,
        lastName: lastName || '',
        tgUsername,
        phoneNumber: phoneNumber,
      },
    });
  }

  async getStudentByTgId(tgId: number) {
    return this.prismaService.student.findUnique({
      where: { tgId: tgId.toString() },
    });
  }

  async getStudentLessons(tgId: number) {
    const student = await this.prismaService.student.findUnique({
      where: { tgId: tgId.toString() },
    });

    const stId = student?.id;

    if (!stId) {
      throw new NotFoundException('Student not found');
    }

    return this.lessonService.findAllbyStudent(stId);
  }

  async getStudentHistoryLessons(tgId: number) {
    const student = await this.prismaService.student.findUnique({
      where: { tgId: tgId.toString() },
    });

    const stId = student?.id;

    if (!stId) {
      throw new NotFoundException('Student not found');
    }

    return this.histroryService.getLessonsHistoryByStId(stId);
  }
}
