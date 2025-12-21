import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDeletedTeacherDto } from './dto/create-deleted-teacher.dto';
import { UpdateDeletedTeacherDto } from './dto/update-deleted-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeletedTeacherService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDeletedTeacherDto: CreateDeletedTeacherDto) {
    const { teacherId, deletedBy, reason, restoreAt } = createDeletedTeacherDto;

    // Check if teacher exists and is not already deleted
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    if (teacher.isDeleted) {
      throw new ConflictException(
        `Teacher with ID ${teacherId} is already deleted`,
      );
    }

    // Check if admin exists and is active
    const admin = await this.prismaService.admin.findUnique({
      where: { id: deletedBy },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${deletedBy} not found`);
    }

    if (!admin.isActive || admin.isDeleted) {
      throw new BadRequestException(
        `Admin with ID ${deletedBy} is not active or has been deleted`,
      );
    }

    // Check if deletion record already exists for this teacher
    const existingDeletion = await this.prismaService.deletedTeacher.findFirst({
      where: { teacherId },
    });

    if (existingDeletion) {
      throw new ConflictException(
        `Deletion record already exists for teacher ID ${teacherId}`,
      );
    }

    // Create deletion record and update teacher in a transaction
    const result = await this.prismaService.$transaction(async (prisma) => {
      // Update teacher's isDeleted status
      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      // Create deletion record
      const deletedTeacher = await prisma.deletedTeacher.create({
        data: {
          teacherId,
          deletedBy,
          reason,
          restoreAt: restoreAt ? new Date(restoreAt) : null,
        },
        include: {
          teacher: true,
        },
      });

      return deletedTeacher;
    });

    return {
      message: 'Teacher deleted successfully',
      deletedTeacher: result,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    deletedBy?: string,
    startDate?: string,
    endDate?: string,
    hasRestoreDate?: boolean,
  ) {
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    if (deletedBy) {
      where.deletedBy = deletedBy;
    }

    if (startDate || endDate) {
      where.deletedAt = {};
      if (startDate) {
        where.deletedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.deletedAt.lte = new Date(endDate);
      }
    }

    if (hasRestoreDate !== undefined) {
      if (hasRestoreDate) {
        where.restoreAt = { not: null };
      } else {
        where.restoreAt = null;
      }
    }

    // Get total count for pagination
    const total = await this.prismaService.deletedTeacher.count({ where });

    // Get deleted teachers with relations
    const deletedTeachers = await this.prismaService.deletedTeacher.findMany({
      where,
      include: {
        teacher: true,
      },
      skip,
      take: limit,
      orderBy: {
        deletedAt: 'desc',
      },
    });

    return {
      message: 'Deleted teachers retrieved successfully',
      deletedTeachers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const deletedTeacher = await this.prismaService.deletedTeacher.findUnique({
      where: { id },
      include: {
        teacher: true,
      },
    });

    if (!deletedTeacher) {
      throw new NotFoundException(
        `Deleted teacher record with ID ${id} not found`,
      );
    }

    return {
      message: 'Deleted teacher retrieved successfully',
      deletedTeacher,
    };
  }

  async update(id: string, updateDeletedTeacherDto: UpdateDeletedTeacherDto) {
    // Check if deletion record exists
    const existingRecord = await this.prismaService.deletedTeacher.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(
        `Deleted teacher record with ID ${id} not found`,
      );
    }

    // Note: teacherId is immutable and should not be updated
    const { teacherId, ...updateData } = updateDeletedTeacherDto as any;

    // If deletedBy is being updated, verify the new admin exists
    if (updateData.deletedBy) {
      const admin = await this.prismaService.admin.findUnique({
        where: { id: updateData.deletedBy },
      });

      if (!admin) {
        throw new NotFoundException(
          `Admin with ID ${updateData.deletedBy} not found`,
        );
      }

      if (!admin.isActive || admin.isDeleted) {
        throw new BadRequestException(
          `Admin with ID ${updateData.deletedBy} is not active or has been deleted`,
        );
      }
    }

    // Convert date strings to Date objects
    if (updateData.restoreAt) {
      updateData.restoreAt = new Date(updateData.restoreAt);
    }

    const deletedTeacher = await this.prismaService.deletedTeacher.update({
      where: { id },
      data: updateData,
      include: {
        teacher: true,
      },
    });

    return {
      message: 'Deleted teacher record updated successfully',
      deletedTeacher,
    };
  }

  async remove(id: string) {
    // Check if deletion record exists
    const existingRecord = await this.prismaService.deletedTeacher.findUnique({
      where: { id },
      include: {
        teacher: true,
      },
    });

    if (!existingRecord) {
      throw new NotFoundException(
        `Deleted teacher record with ID ${id} not found`,
      );
    }

    // Check if teacher still exists
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id: existingRecord.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${existingRecord.teacherId} not found`,
      );
    }

    // Check if restore date has been set and hasn't passed yet
    if (existingRecord.restoreAt) {
      const now = new Date();
      if (existingRecord.restoreAt > now) {
        throw new BadRequestException(
          `Cannot restore teacher yet. Restoration date is set to ${existingRecord.restoreAt.toISOString()}`,
        );
      }
    }

    // Restore teacher and remove deletion record in a transaction
    const result = await this.prismaService.$transaction(async (prisma) => {
      // Restore teacher's isDeleted status
      const restoredTeacher = await prisma.teacher.update({
        where: { id: existingRecord.teacherId },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      });

      // Delete the deletion record
      await prisma.deletedTeacher.delete({
        where: { id },
      });

      return restoredTeacher;
    });

    return {
      message: 'Teacher restored successfully',
      teacher: result,
    };
  }
}
