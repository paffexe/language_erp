import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirm_password,
      cardNumber,
      specification,
      googleId,
    } = createTeacherDto;

    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const isExists = await this.prismaService.teacher.findFirst({
      where: {
        OR: [{ email }, { cardNumber }, { phoneNumber }],
      },
    });

    if (isExists) {
      if (isExists.email === email) {
        throw new BadRequestException('Email already in use');
      }
      if (isExists.cardNumber === cardNumber) {
        throw new BadRequestException('Card number already in use');
      }
      if (isExists.phoneNumber === phoneNumber) {
        throw new BadRequestException('Phone number already in use');
      }
    }

    const hashPassword = await bcrypt.hash(password, 7);

    const teacher = await this.prismaService.teacher.create({
      data: {
        googleId,
        specification,
        fullName,
        email,
        phoneNumber,
        cardNumber,
        password: hashPassword,
      },
    });

    return {
      message: 'Teacher created successfully',
      teacher,
    };
  }

  findAll() {
    return this.prismaService.teacher.findMany();
  }

  async findOne(id: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return this.prismaService.teacher.update({
      where: { id },
      data: updateTeacherDto,
    });
  }

  async remove(id: string) {
    const user = await this.prismaService.teacher.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Teacher with this ${id} not found`);
    }

    return this.prismaService.teacher.delete({ where: { id } });
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, teacher.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 7);

    await this.prismaService.teacher.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}
