import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import {
  UpdateAdminProfileDto,
  UpdateTeacherProfileDto,
} from './dto/update-profile.dto';
import { Tokens } from '../common/types/tokens.type';
import { Admin, Teacher } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { SmsService } from '../common/services/sms.service';
import { TeacherService } from '../teacher/teacher.service';

const otpStore = new Map<
  string,
  { otp: string; expiresAt: Date; teacherId: string }
>();

export interface GoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  imageUrl?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly teacherService: TeacherService,
  ) {}

  async loginAdmin(dto: LoginDto, res: Response) {
    const admin = await this.prisma.admin.findFirst({
      where: { username: dto.username, isDeleted: false },
    });

    if (!admin) {
      throw new UnauthorizedException("Username yoki parol noto'g'ri");
    }

    if (!admin.isActive) {
      throw new ForbiddenException('Akkaunt faol emas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Username yoki parol noto'g'ri");
    }

    const tokens = await this.generateAdminTokens(admin);

    this.setRefreshTokenCookie(res, tokens.refreshToken, 'admin');

    return {
      message: 'Tizimga muvaffaqiyatli kirdingiz',
      id: admin.id,
      role: admin.role,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logoutAdmin(res: Response) {
    res.clearCookie('adminRefreshToken');
    return { message: 'Tizimdan muvaffaqiyatli chiqdingiz' };
  }

  async refreshAdminToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token topilmadi');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
      });

      const admin = await this.prisma.admin.findFirst({
        where: { id: payload.id, isDeleted: false, isActive: true },
      });

      if (!admin) {
        throw new ForbiddenException('Admin topilmadi');
      }

      const tokens = await this.generateAdminTokens(admin);
      this.setRefreshTokenCookie(res, tokens.refreshToken, 'admin');

      return {
        message: 'Token yangilandi',
        accessToken: tokens.accessToken,
      };
    } catch {
      throw new ForbiddenException('Refresh token yaroqsiz');
    }
  }

  async getAdminProfile(adminId: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isDeleted: false },
      select: {
        id: true,
        username: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }

    return admin;
  }

  async updateAdminProfile(adminId: string, dto: UpdateAdminProfileDto) {
    const admin = await this.prisma.admin.findFirst({
      where: { id: adminId, isDeleted: false },
    });

    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }

    if (dto.username && dto.username !== admin.username) {
      const exists = await this.prisma.admin.findFirst({
        where: { username: dto.username, isDeleted: false },
      });
      if (exists) {
        throw new BadRequestException('Bu username allaqachon mavjud');
      }
    }
    if (dto.phoneNumber && dto.phoneNumber !== admin.phoneNumber) {
      const exists = await this.prisma.admin.findFirst({
        where: { phoneNumber: dto.phoneNumber, isDeleted: false },
      });
      if (exists) {
        throw new BadRequestException('Bu telefon raqam allaqachon mavjud');
      }
    }

    const updated = await this.prisma.admin.update({
      where: { id: adminId },
      data: dto,
      select: {
        id: true,
        username: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Profil yangilandi',
      admin: updated,
    };
  }

  async loginTeacher(dto: LoginDto, res: Response) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ email: dto.username }, { phoneNumber: dto.username }],
        isDeleted: false,
      },
    });

    if (!teacher) {
      throw new UnauthorizedException("Email/telefon yoki parol noto'g'ri");
    }

    if (!teacher.isActive) {
      throw new ForbiddenException('Akkaunt faol emas');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      teacher.password.trim(),
    );

    console.log('Dto password', dto.password);
    console.log('teacher password', teacher.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Email/telefon yoki parol noto'g'ri");
    }

    const tokens = await this.generateTeacherTokens(teacher);
    this.setRefreshTokenCookie(res, tokens.refreshToken, 'teacher');

    return {
      message: 'Tizimga muvaffaqiyatli kirdingiz',
      id: teacher.id,
      role: 'teacher',
      accessToken: tokens.accessToken,
    };
  }

  async logoutTeacher(res: Response) {
    res.clearCookie('teacherRefreshToken');
    return { message: 'Tizimdan muvaffaqiyatli chiqdingiz' };
  }

  async refreshTeacherToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token topilmadi');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const teacher = await this.prisma.teacher.findFirst({
        where: { id: payload.id, isDeleted: false, isActive: true },
      });

      if (!teacher) {
        throw new ForbiddenException('Teacher topilmadi');
      }

      const tokens = await this.generateTeacherTokens(teacher);
      this.setRefreshTokenCookie(res, tokens.refreshToken, 'teacher');

      return {
        message: 'Token yangilandi',
        accessToken: tokens.accessToken,
      };
    } catch {
      throw new ForbiddenException('Refresh token yaroqsiz');
    }
  }

  async getTeacherProfile(teacherId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, isDeleted: false },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        specification: true,
        level: true,
        description: true,
        hourPrice: true,
        portfolioLink: true,
        imageUrl: true,
        rating: true,
        experience: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        cardNumber: true,
        lessons: {
          select: {
            id: true,
            completedAt: true,
            status: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher topilmadi');
    }

    return {
      message: 'Muvaffaqiyatli olindi',
      teacher,
    };
  }

  async updateTeacherProfile(teacherId: string, dto: UpdateTeacherProfileDto) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, isDeleted: false },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher topilmadi');
    }

    if (dto.phoneNumber && dto.phoneNumber !== teacher.phoneNumber) {
      const exists = await this.prisma.teacher.findFirst({
        where: { phoneNumber: dto.phoneNumber, isDeleted: false },
      });
      if (exists) {
        throw new BadRequestException('Bu telefon raqam allaqachon mavjud');
      }
    }

    const updated = await this.prisma.teacher.update({
      where: { id: teacherId },
      data: dto,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        specification: true,
        level: true,
        description: true,
        hourPrice: true,
        portfolioLink: true,
        imageUrl: true,
        rating: true,
        experience: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Profil yangilandi',
      teacher: updated,
    };
  }

  private async generateAdminTokens(admin: Admin): Promise<Tokens> {
    const payload = {
      id: admin.id,
      role: admin.role,
      is_active: admin.isActive,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
        expiresIn: 54000,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
        expiresIn: 1296000,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateTeacherTokens(teacher: Teacher): Promise<Tokens> {
    const payload = {
      id: teacher.id,
      role: teacher.role,
      is_active: teacher.isActive,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: 54000,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: 1296000,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(
    res: Response,
    token: string,
    type: 'admin' | 'teacher',
  ) {
    const cookieName =
      type === 'admin' ? 'adminRefreshToken' : 'teacherRefreshToken';
    const maxAge =
      type === 'admin'
        ? Number(process.env.ADMIN_COOKIE_TIME) || 1296000000
        : Number(process.env.COOKIE_TIME) || 1296000000;

    res.cookie(cookieName, token, {
      httpOnly: true,
      maxAge,
      sameSite: 'strict',
    });
  }

  async googleLogin(googleUser: GoogleUser, res: Response) {
    if (!googleUser) {
      throw new BadRequestException('Google autentifikatsiya muvaffaqiyatsiz');
    }

    let teacher = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
        isDeleted: false,
      },
    });

    if (teacher) {
      teacher = await this.prisma.teacher.update({
        where: { id: teacher.id },
        data: {
          googleId: googleUser.googleId,
          googleAccessToken: googleUser.googleAccessToken,
          googleRefreshToken: googleUser.googleRefreshToken,
          imageUrl: googleUser.imageUrl || teacher.imageUrl,
        },
      });

      if (!teacher.isActive) {
        throw new ForbiddenException('Akkaunt faol emas');
      }
    } else {
      const tempPassword = 'temp_hashed_password';
      const random_card = Math.floor(10000 + Math.random() * 90000).toString();

      teacher = await this.prisma.teacher.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          fullName: googleUser.fullName,
          imageUrl: googleUser.imageUrl,
          googleAccessToken: googleUser.googleAccessToken,
          googleRefreshToken: googleUser.googleRefreshToken,
          password: tempPassword,
          phoneNumber: `temp_${googleUser.googleId}`,
          cardNumber: `card_${random_card}`,
        },
      });
    }

    console.log('Temp password has been applied');

    const tokens = await this.generateTeacherTokens(teacher);
    this.setRefreshTokenCookie(res, tokens.refreshToken, 'teacher');

    return {
      message: 'Google orqali muvaffaqiyatli kirdingiz',
      id: teacher.id,
      email: teacher.email,
      fullName: teacher.fullName,
      isNewUser:
        !teacher.phoneNumber || teacher.phoneNumber.startsWith('temp_'),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async sendOtp(
    phoneNumber: string,
    teacherId: string,
    password: string,
    confirmPassword: string,
  ) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId, isDeleted: false },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher topilmadi');
    }
    const existingTeacher = await this.prisma.teacher.findFirst({
      where: {
        phoneNumber: phoneNumber,
        id: { not: teacherId },
        isDeleted: false,
      },
    });

    if (existingTeacher) {
      throw new BadRequestException(
        "Bu telefon raqam allaqachon ro'yxatdan o'tgan",
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Parollar mos emas');
    }

    console.log('this is user input passowrd', confirmPassword);

    const hashedPassword = await bcrypt.hash(password, 7);

    await this.prisma.teacher.update({
      where: { id: teacherId },
      data: { password: hashedPassword },
    });

    console.log('password is hashed');

    const otp = this.smsService.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 daqiqa

    otpStore.set(phoneNumber, { otp, expiresAt, teacherId });

    console.log('this is otp', otp);

    const sent = await this.smsService.sendOtp(phoneNumber, otp);

    if (!sent) {
      throw new BadRequestException('SMS yuborishda xatolik yuz berdi');
    }

    return {
      message: 'OTP kod yuborildi',
      phoneNumber,
      expiresIn: 300,
    };
  }

  async verifyOtp(phoneNumber: string, otp: string, res: Response) {
    const stored = otpStore.get(phoneNumber);

    if (!stored) {
      throw new BadRequestException('OTP topilmadi yoki muddati tugagan');
    }

    if (new Date() > stored.expiresAt) {
      otpStore.delete(phoneNumber);
      throw new BadRequestException('OTP muddati tugagan');
    }

    if (stored.otp !== otp) {
      throw new BadRequestException("OTP noto'g'ri");
    }

    const teacher = await this.prisma.teacher.update({
      where: { id: stored.teacherId },
      data: { phoneNumber },
    });

    otpStore.delete(phoneNumber);

    const tokens = await this.generateTeacherTokens(teacher);
    this.setRefreshTokenCookie(res, tokens.refreshToken, 'teacher');

    return {
      message: 'Telefon raqam muvaffaqiyatli tasdiqlandi',
      id: teacher.id,
      email: teacher.email,
      fullName: teacher.fullName,
      phoneNumber: teacher.phoneNumber,
      accessToken: tokens.accessToken,
    };
  }

  async resendOtp(phoneNumber: string, teacherId: string) {
    otpStore.delete(phoneNumber);

    return this.sendOtp(phoneNumber, teacherId, '', '');
  }
}
