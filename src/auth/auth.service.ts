import {
  ConflictException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import { AdminService } from '../admin/admin.service';

import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Tokens } from '../common/types/tokens.type';
import { TeacherService } from '../teacher/teacher.service';
import { JwtPayload } from '../common/types/admin/admin.payload.types';
import { Admin } from '../../generated/prisma/browser';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly teacherService: TeacherService,
  ) {}

  async generateTokens(admin: Admin) {
    const payload: JwtPayload = {
      id: admin.id,
      role: admin.role,
      is_active: admin.isActive,
    };


    // const [accessToken, refreshToken] = await Promise.all([
    //   this.jwtService.signAsync(payload, {
    //     secret: process.env.ACCESS_TOKEN_KEY,
    //     expiresIn: process.env.ACCESS_TOKEN_TIME,
    //   }),
    //   this.jwtService.signAsync(payload, {
    //     secret: process.env.REFRESH_TOKEN_KEY,
    //     expiresIn: process.env.REFRESH_TOKEN_TIME,
    //   }),
    // ]);
    // return {
    //   accessToken,
    //   refreshToken,
    // };
  }

  // async generateAdminTokens(admin: Admin) {
  //   const payload: JwtPayload = {
  //     id: admin.id,
  //     role: admin.role,
  //     is_active: admin.isActive,
  //   };

  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(payload, {
  //       secret: process.env.ADMIN_ACCESS_TOKEN_KEY!,
  //       expiresIn: process.env.ADMIN_ACCESS_TOKEN_TIME!,
  //     }),
  //     this.jwtService.signAsync(payload, {
  //       secret: process.env.ADMIN_REFRESH_TOKEN_KEY!,
  //       expiresIn: process.env.ADMIN_REFRESH_TOKEN_TIME!,
  //     }),
  //   ]);
  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  // admin
  // async logInAdmin(loginAdmin: SignInAdminDto, res: Response) {
  //   const { email, password: log_password } = loginAdmin;

  //   const admin = await this.prismaService.admin.findUnique({
  //     where: { email },
  //   });

  //   if (!admin) {
  //     throw new UnauthorizedException("Email yoki password noto'g'ri");
  //   }

  //   const isValid = await bcrypt.compare(log_password, admin.password);

  //   if (!isValid) {
  //     throw new UnauthorizedException("Email yoki password noto'g'ri");
  //   }

  //   const { accessToken, refreshToken } = await this.generateAdminTokens(admin);
  //   const refresh_token = await bcrypt.hash(refreshToken, 7);
  //   await this.prismaService.admin.update({
  //     where: { id: admin.id },
  //     data: { refresh_token, is_active: true },
  //   });

  //   res.cookie('refreshToken', refreshToken, {
  //     maxAge: +process.env.ADMIN_COOKIE_TIME!,
  //     httpOnly: true,
  //   });

  //   return { message: 'Tizimga xush kelibsiz', id: admin.id, accessToken };
  // }

  // async logoutAdmin(adminId: number, res: Response) {
  //   const user = await this.prismaService.admin.updateMany({
  //     where: {
  //       id: adminId,
  //       refresh_token: {
  //         not: null,
  //       },
  //     },
  //     data: {
  //       refresh_token: null,
  //       is_active: false,
  //     },
  //   });

  //   if (!user) throw new ForbiddenException('Access denied');
  //   res.clearCookie('refreshToken');
  //   return true;
  // }

  // async refreshAdminToken(
  //   userId: number,
  //   refreshToken: string,
  //   res: Response,
  // ): Promise<AdminResponseFields> {
  //   const user = await this.prismaService.admin.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user || !user.refresh_token)
  //     throw new ForbiddenException('Access denied');

  //   const rtMatches = await bcrypt.compare(refreshToken, user.refresh_token);

  //   if (!rtMatches) {
  //     throw new ForbiddenException('Access denied');
  //   }

  //   const tokens: Tokens = await this.generateAdminTokens(user);

  //   // const hashedRefreshToken = await bcrypt.hash(tokens.accessToken, 7);
  //   const hashedRefreshToken = await bcrypt.hash(tokens.accessToken, 7);

  //   await this.prismaService.admin.update({
  //     where: { id: user.id },
  //     data: { refresh_token: hashedRefreshToken },
  //   });

  //   res.cookie('refreshToken', tokens.refreshToken, {
  //     maxAge: +process.env.ADMIN_COOKIE_TIME!,
  //     httpOnly: true,
  //   });

  //   return {
  //     message: 'User refreshed successfully',
  //     adminId: user.id,
  //     accessToken: tokens.accessToken,
  //   };
  // }

  // // super admin

  // async superAdminLog(loginAdmin: SignInAdminDto, res: Response) {
  //   const { email, password: log_password } = loginAdmin;

  //   const admin = await this.prismaService.rootUser.findUnique({
  //     where: { email },
  //   });

  //   if (!admin) {
  //     throw new UnauthorizedException("Email yoki password noto'g'ri");
  //   }

  //   const isValid = await bcrypt.compare(log_password, admin.password);

  //   if (!isValid) {
  //     throw new UnauthorizedException("Email yoki password noto'g'ri");
  //   }

  //   const { accessToken, refreshToken } = await this.generateAdminTokens(admin);
  //   const refresh_token = await bcrypt.hash(refreshToken, 7);
  //   await this.prismaService.rootUser.update({
  //     where: { id: admin.id },
  //     data: { refresh_token, is_active: true },
  //   });

  //   res.cookie('refreshToken', refreshToken, {
  //     maxAge: +process.env.ADMIN_COOKIE_TIME!,
  //     httpOnly: true,
  //   });

  //   return { message: 'Tizimga xush kelibsiz', id: admin.id, accessToken };
  // }

  // async logoutSuperAdmin(adminId: number, res: Response) {
  //   const user = await this.prismaService.admin.updateMany({
  //     where: {
  //       id: adminId,
  //       refresh_token: {
  //         not: null,
  //       },
  //     },
  //     data: {
  //       refresh_token: null,
  //       is_active: false,
  //     },
  //   });

  //   if (!user) throw new ForbiddenException('Access denied');
  //   res.clearCookie('refreshToken');
  //   return true;
  // }
}
