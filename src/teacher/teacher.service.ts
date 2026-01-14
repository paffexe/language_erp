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
import { unlink } from 'fs/promises';
import { join } from 'path';
// import sharp from 'sharp';
// import sharp from 'sharp';
const sharp = require('sharp');

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly UPLOAD_DIR = './uploads/teachers';
  private readonly MAX_WIDTH = 800;
  private readonly MAX_HEIGHT = 800;
  private readonly QUALITY = 80;

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
      level,
      description,
      hourPrice,
      portfolioLink,
      experience,
      isActive,
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
        level,
        description,
        hourPrice,
        portfolioLink,
        experience,
        isActive: isActive ?? true,
      },
    });

    return {
      message: 'Teacher created successfully',
      teacher,
    };
  }

  async findAll() {
    const teachers = await this.prismaService.teacher.findMany();

    return {
      message: 'Teachers retrieved successfully',
      teachers: teachers || [],
    };
  }

  async findOne(id: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return {
      message: 'Teacher retrieved successfully',
      teacher,
    };
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const updatedTeacher = await this.prismaService.teacher.update({
      where: { id },
      data: updateTeacherDto,
    });

    return {
      message: 'Teacher updated successfully',
      teacher: updatedTeacher,
    };
  }

  async remove(id: string) {
    const user = await this.prismaService.teacher.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Teacher with this ${id} not found`);
    }

    const deletedTeacher = await this.prismaService.teacher.delete({
      where: { id },
    });
    return {
      message: 'Teacher deleted successfully',
      deletedTeacher,
    };
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

  // Add this method to your TeacherService class
  async uploadImage(id: string, filename: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      await this.deleteFile(join(this.UPLOAD_DIR, filename));
      throw new NotFoundException('Teacher not found');
    }

    try {
      // Compress and optimize the image
      const inputPath = join(this.UPLOAD_DIR, filename);
      const compressedFilename = `compressed-${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}.jpg`;
      const outputPath = join(this.UPLOAD_DIR, compressedFilename);

      await sharp(inputPath)
        .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: this.QUALITY, progressive: true })
        .toFile(outputPath);

      // Delete the original uncompressed file
      await this.deleteFile(inputPath);

      // Delete old image if exists
      if (teacher.imageUrl) {
        await this.deleteFile(join('./', teacher.imageUrl));
      }

      const imageUrl = `uploads/teachers/${compressedFilename}`;
      const updatedTeacher = await this.prismaService.teacher.update({
        where: { id },
        data: { imageUrl },
      });
      return {
        message: 'Image uploaded and compressed successfully',
        teacher: updatedTeacher,
      };
    } catch (error) {
      // Clean up on error
      await this.deleteFile(join(this.UPLOAD_DIR, filename));
      throw error;
    }
  }
  private async deleteFile(path: string): Promise<void> {
    await unlink(path).catch(() => {});
  }

  async deleteImage(id: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (!teacher.imageUrl) {
      throw new BadRequestException('Teacher has no image to delete');
    }

    // Delete the file
    const imagePath = join('./', teacher.imageUrl);
    await unlink(imagePath).catch(() => { });

    // Update database
    const updatedTeacher = await this.prismaService.teacher.update({
      where: { id },
      data: { imageUrl: null },
    });

    return {
      message: 'Image deleted successfully',
      teacher: updatedTeacher,
    };
  }
}
