import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonTemplateDto } from './dto/create-lesson-template.dto';
import { UpdateLessonTemplateDto } from './dto/update-lesson-template.dto';

@Injectable()
export class LessonTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonTemplateDto) {
    try {
      return await this.prisma.lessonTemplate.create({
        data: {
          teacherId: dto.teacherId,
          name: dto.name,
          timeSlot: dto.timeSlot,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson template yaratishda xatolik',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.lessonTemplate.findMany({
        where: { isDeleted: false },
        include: {
          teacher: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson template lar olinmadi',
      );
    }
  }

  async findOne(id: string) {
    const template = await this.prisma.lessonTemplate.findFirst({
      where: { id, isDeleted: false },
      include: {
        teacher: true,
      },
    });

    if (!template) {
      throw new NotFoundException('Lesson template topilmadi');
    }

    return template;
  }

  async update(id: string, dto: UpdateLessonTemplateDto) {
    await this.findOne(id);

    try {
      return await this.prisma.lessonTemplate.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson template yangilanmadi',
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.lessonTemplate.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lesson template o‘chirilmadi',
      );
    }
  }
}
