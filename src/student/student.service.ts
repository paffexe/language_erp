import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StudentQueryDto } from './dto/student-query.dto';
import { LessonService } from '../lesson/lesson.service';
import { StudentResponseDto } from './dto/student-response.dto';
import { PaginatedResponseDto } from 'src/common/pagination/response/pagination-response.dto';
import { PaginationHelper } from 'src/common/helpers/pagination-helper';
import { Student } from 'generated/prisma/client';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lessonService: LessonService,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    try {
      return await this.prisma.student.create({
        data: createStudentDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Phone number or Telegram ID already exists',
        );
      }
      throw error;
    }
  }

  // async findAll(query: StudentQueryDto) {
  //   const students = await this.prisma.student.findMany();

  //   if (students.length === 0) {
  //     throw new NotFoundException('No students found');
  //   }

  //   return {
  //     message: 'Students retrieved successfully',
  //     students,
  //   };
  // }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<StudentResponseDto>> {
    return PaginationHelper.paginate<Student, StudentResponseDto>(
      this.prisma.student,
      { isDeleted: false },
      { page, limit },
      { orderBy: { createdAt: 'desc' } },
      (student: Student) => new StudentResponseDto(student),
    );
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    return {
      message: 'Student found successfully',
      student,
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    try {
      return await this.prisma.student.update({
        where: { id },
        data: updateStudentDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Phone number or Telegram ID already exists',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.student.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return this.prisma.student.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });
  }

  async hardDelete(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    await this.prisma.student.delete({ where: { id } });
  }

  async block(id: string, reason?: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.student.update({
      where: { id },
      data: { isBlocked: true, blockedAt: new Date(), blockedReason: reason },
    });
  }

  async unblock(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.student.update({
      where: { id },
      data: { isBlocked: false, blockedAt: null, blockedReason: null },
    });
  }

  async findLessons(id: string) {
    const Mylessons = await this.lessonService.findAllbyStudent(id);
    if (!Mylessons) {
      throw new NotFoundException('No lessons found for this student');
    }
    return {
      message: 'Lessons retrieved successfully',
      lessons: Mylessons,
    };
  }

  async findTeachers() {
    const Teachers = await this.prisma.teacher.findMany();
    if (!Teachers) {
      throw new NotFoundException('No teachers found');
    }
    return {
      message: 'Teachers retrieved successfully',
      teachers: Teachers,
    };
  }
}
