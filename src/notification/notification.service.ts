import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FindNotificationsDto } from './dto/find-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });
    if (!student) throw new NotFoundException('Student not found');

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const existingNotification = await this.prisma.notification.findUnique({
      where: { lessonId: dto.lessonId },
    });
    if (existingNotification)
      throw new BadRequestException(
        'Notification already exists for this lesson',
      );

    return this.prisma.notification.create({
      data: {
        studentId: dto.studentId,
        lessonId: dto.lessonId,
        message: dto.message,
        sendAt: new Date(dto.sendAt), 
        isSend: dto.isSend ?? false,
      },
    });
  }

  async findAll(query: FindNotificationsDto) {
    const {
      page = 1,
      limit = 10,
      studentId,
      lessonId,
      isSend,
      isDeleted,
      sendAtFrom,
      sendAtTo,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: isDeleted ?? false };
    if (studentId) where.studentId = studentId;
    if (lessonId) where.lessonId = lessonId;
    if (isSend !== undefined) where.isSend = isSend;
    if (sendAtFrom || sendAtTo) {
      where.sendAt = {};
      if (sendAtFrom) where.sendAt.gte = new Date(sendAtFrom);
      if (sendAtTo) where.sendAt.lte = new Date(sendAtTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.isDeleted)
      throw new NotFoundException('Notification not found');

    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.isDeleted)
      throw new NotFoundException('Notification not found');

    if (dto.lessonId && dto.lessonId !== notification.lessonId) {
      const existingNotification = await this.prisma.notification.findUnique({
        where: { lessonId: dto.lessonId },
      });
      if (existingNotification)
        throw new BadRequestException(
          'Notification already exists for this lesson',
        );
    }

    const data: Partial<typeof dto> = {};
    if (dto.studentId) data.studentId = dto.studentId;
    if (dto.lessonId) data.lessonId = dto.lessonId;
    if (dto.message) data.message = dto.message;
    if (dto.sendAt) data.sendAt = new Date(dto.sendAt);
    if (dto.isSend !== undefined) data.isSend = dto.isSend;

    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.isDeleted)
      throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });
  }

  async hardDelete(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async markAsSent(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.isDeleted)
      throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { isSend: true },
    });
  }
}
