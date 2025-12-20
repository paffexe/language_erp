import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindTransactionsDto } from './dto/find-transaction.dto';
import { TransactionStatus } from '../../generated/prisma/enums';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    try {
      return await this.prisma.transaction.create({
        data: {
          price: dto.price,
          status: dto.status,
          reason: dto.reason ?? null,
          canceledTime: dto.canceledTime ? new Date(dto.canceledTime) : null,
          performedTime: dto.performedTime ? new Date(dto.performedTime) : null,
          lesson: { connect: { id: dto.lessonId } },
          student: { connect: { id: dto.studentId } },
        },
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException('Lesson or Student not found');
      }
      throw e;
    }
  }

  async findAll(query: FindTransactionsDto) {
    const {
      page = 1,
      limit = 10,
      lessonId,
      studentId,
      status,
      performedTimeFrom,
      performedTimeTo,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (lessonId) where.lessonId = lessonId;
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    if (performedTimeFrom || performedTimeTo) {
      where.performedTime = {};
      if (performedTimeFrom)
        where.performedTime.gte = new Date(performedTimeFrom);
      if (performedTimeTo) where.performedTime.lte = new Date(performedTimeTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lesson: {
            select: { id: true, name: true, startTime: true, endTime: true },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
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
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, isDeleted: false },
      include: {
        lesson: {
          select: { id: true, name: true, startTime: true, endTime: true },
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    if (
      transaction.status === TransactionStatus.paid &&
      dto.status === TransactionStatus.cancelled
    ) {
      throw new BadRequestException(
        'Completed transaction cannot be cancelled',
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        lessonId: dto.lessonId,
        studentId: dto.studentId,
        price: dto.price,
        status: dto.status,
        reason: dto.reason,
        canceledTime: dto.canceledTime ? new Date(dto.canceledTime) : undefined,
        performedTime: dto.performedTime
          ? new Date(dto.performedTime)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.transaction.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async cancelTransaction(id: string, reason?: string) {
    const transaction = await this.findOne(id);

    if (transaction.status === TransactionStatus.cancelled) {
      throw new BadRequestException('Transaction already cancelled');
    }

    if (transaction.status === TransactionStatus.paid) {
      throw new BadRequestException(
        'Completed transaction cannot be cancelled',
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.cancelled,
        canceledTime: new Date(),
        reason: reason ?? transaction.reason,
      },
    });
  }

  async completeTransaction(id: string) {
    const transaction = await this.findOne(id);

    if (transaction.status === TransactionStatus.paid) {
      throw new BadRequestException('Transaction already completed');
    }

    if (transaction.status === TransactionStatus.cancelled) {
      throw new BadRequestException(
        'Cancelled transaction cannot be completed',
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.paid,
        performedTime: new Date(),
      },
    });
  }

  async getStudentTransactions(studentId: string) {
    return this.prisma.transaction.findMany({
      where: { studentId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        lesson: {
          select: { id: true, name: true, startTime: true, endTime: true },
        },
      },
    });
  }

  async getLessonTransactions(lessonId: string) {
    return this.prisma.transaction.findMany({
      where: { lessonId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }
}
