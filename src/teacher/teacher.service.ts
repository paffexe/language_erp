import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

    // return this.prismaService.teacher.create({
    //   data: {
    //     specification,
    //     fullName,
    //     email,
    //     phoneNumber,
    //     cardNumber,
    //     password: hashPassword,
    //   },
    // });
  }

  findAll() {
    return `This action returns all teacher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
