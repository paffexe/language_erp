import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonTemplateDto } from './dto/create-lesson-template.dto';
import { UpdateLessonTemplateDto } from './dto/update-lesson-template.dto';

@Injectable()
export class LessonTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonTemplateDto) {
    const template = await this.prisma.lessonTemplate.create({
      data: {
        teacherId: dto.teacherId,
        name: dto.name,
        timeSlot: dto.timeSlot,
        isActive: dto.isActive ?? true,
      },
    });

    return {
      message: 'Lesson template created successfully',
      template,
    };
  }

  async findAll() {
    const templates = await this.prisma.lessonTemplate.findMany({
      where: { isDeleted: false },
      include: {
        teacher: true,
      },
    });

    if (!templates.length) {
      throw new NotFoundException('No lesson templates found');
    }

    return {
      message: 'Lesson templates retrieved successfully',
      templates,
    };
  }

  async findOne(id: string) {
    const template = await this.prisma.lessonTemplate.findFirst({
      where: { id, isDeleted: false },
      include: {
        teacher: true,
      },
    });

    if (!template) {
      throw new NotFoundException('Lesson template not found');
    }

    return {
      message: 'Lesson template retrieved successfully',
      template,
    };
  }

  async update(id: string, dto: UpdateLessonTemplateDto) {
    await this.findOne(id);

    const updatedTemplate = await this.prisma.lessonTemplate.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Lesson template updated successfully',
      template: updatedTemplate,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedTemplate = await this.prisma.lessonTemplate.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Lesson template deleted successfully',
      template: deletedTemplate,
    };
  }
}
