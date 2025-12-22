import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BotService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
