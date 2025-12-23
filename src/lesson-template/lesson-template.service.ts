import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonTemplateDto } from './dto/create-lesson-template.dto';
import { UpdateLessonTemplateDto } from './dto/update-lesson-template.dto';

@Injectable()
export class LessonTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonTemplateDto) {
    try {
      // 1️⃣ Teacher mavjudligini tekshirish
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: dto.teacherId },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      // 2️⃣ Teacher faol ekanligini tekshirish
      if (!teacher.isActive || teacher.isDeleted) {
        throw new BadRequestException('Teacher is not active');
      }

      // 3️⃣ Duplicate template tekshiruvi (nom + timeSlot + teacher)
      const existingTemplate = await this.prisma.lessonTemplate.findFirst({
        where: {
          teacherId: dto.teacherId,
          name: dto.name,
          timeSlot: dto.timeSlot,
          isDeleted: false,
        },
      });
      if (existingTemplate) {
        throw new BadRequestException(
          'A lesson template with the same name and time slot already exists for this teacher',
        );
      }

      // 4️⃣ Create
      const template = await this.prisma.lessonTemplate.create({
        data: {
          teacherId: dto.teacherId,
          name: dto.name,
          timeSlot: dto.timeSlot,
          isActive: dto.isActive ?? true,
        },
      });

      return {
        statusCode: 201,
        message: 'Lesson template created successfully',
        template,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error('LessonTemplate creation error:', error);

      throw new InternalServerErrorException(
        'Lesson template creation failed',
      );
    }
  }

   async findAll() {
    try {
      const [templates, count] = await this.prisma.$transaction([
        this.prisma.lessonTemplate.findMany({
          where: { isDeleted: false },
          include: { teacher: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.lessonTemplate.count({
          where: { isDeleted: false },
        }),
      ]);

      if (!count) {
        throw new NotFoundException('No lesson templates found');
      }

      return {
        statusCode: 200,
        message: 'Lesson templates retrieved successfully',
        count,
        templates,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error retrieving lesson templates:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve lesson templates',
      );
    }
  }

  async findOne(id: string) {
    try {
      const template = await this.prisma.lessonTemplate.findFirst({
        where: { id, isDeleted: false },
        include: { teacher: true },
      });

      if (!template) {
        throw new NotFoundException('Lesson template not found');
      }

      return {
        statusCode: 200,
        message: 'Lesson template retrieved successfully',
        template,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Error retrieving lesson template with id ${id}:`, error);
      throw new InternalServerErrorException(
        'Failed to retrieve lesson template',
      );
    }
  }

   async update(id: string, dto: UpdateLessonTemplateDto) {
    try {
      // 1️⃣ Template mavjudligini tekshirish
      const existingTemplate = await this.prisma.lessonTemplate.findFirst({
        where: { id, isDeleted: false },
      });

      if (!existingTemplate) {
        throw new NotFoundException('Lesson template not found');
      }

      // 2️⃣ Teacher mavjudligini va aktivligini tekshirish (agar teacherId o‘zgargan bo‘lsa)
      const teacherId = dto.teacherId ?? existingTemplate.teacherId;
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      if (!teacher.isActive || teacher.isDeleted) {
        throw new BadRequestException('Teacher is not active');
      }

      // 3️⃣ Duplicate check (nom + timeSlot + teacher) excluding o‘zini
      const duplicateTemplate = await this.prisma.lessonTemplate.findFirst({
        where: {
          id: { not: id },
          teacherId,
          name: dto.name ?? existingTemplate.name,
          timeSlot: dto.timeSlot ?? existingTemplate.timeSlot,
          isDeleted: false,
        },
      });

      if (duplicateTemplate) {
        throw new BadRequestException(
          'A lesson template with the same name and time slot already exists for this teacher',
        );
      }

      // 4️⃣ UPDATE
      const updatedTemplate = await this.prisma.lessonTemplate.update({
        where: { id },
        data: {
          ...dto,
        },
      });

      return {
        statusCode: 200,
        message: 'Lesson template updated successfully',
        template: updatedTemplate,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error(`Error updating lesson template with id ${id}:`, error);

      throw new InternalServerErrorException(
        'Failed to update lesson template',
      );
    }
  } 

  async remove(id: string) {
    try {
      // 1️⃣ Template mavjudligini tekshirish
      const template = await this.prisma.lessonTemplate.findFirst({
        where: { id, isDeleted: false },
      });

      if (!template) {
        throw new NotFoundException(
          'Lesson template not found or already deleted',
        );
      }

      // 2️⃣ OPTIONAL BUSINESS RULE:
      // Agar template ishlatilayotgan bo‘lsa (masalan, asosiy Lesson yaratilgan bo‘lsa), o‘chirmaslik
      const usedInLesson = await this.prisma.lesson.findFirst({
        where: { isDeleted: false, teacherId: template.teacherId, name: template.name },
      });

      if (usedInLesson) {
        throw new BadRequestException(
          'This template is currently used in a lesson and cannot be deleted',
        );
      }

      // 3️⃣ Soft delete
      const deletedTemplate = await this.prisma.lessonTemplate.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return {
        statusCode: 200,
        message: 'Lesson template deleted successfully',
        template: deletedTemplate,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(`Error deleting lesson template with id ${id}:`, error);
      throw new InternalServerErrorException(
        'Failed to delete lesson template',
      );
    }
  }
}
