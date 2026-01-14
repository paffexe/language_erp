import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminResponseDto } from './dto/admin-response.dto';
import * as bcrypt from 'bcrypt';
import { AdminQueryDto } from './dto/admin-query.dto';
import { AdminRole, Prisma } from '../../generated/prisma/client';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }
  async create(dto: CreateAdminDto): Promise<AdminResponseDto> {
    const exists = await this.prisma.admin.findFirst({
      where: {
        OR: [{ username: dto?.username }, { phoneNumber: dto?.phoneNumber }],
        isDeleted: false,
      },
    });

    if (exists) {
      throw new ConflictException('Username or phone already exists');
    }

    // SuperAdmin faqat bitta bo'lishi mumkin
    if (dto.role === AdminRole.superAdmin) {
      const superAdminExists = await this.prisma.admin.findFirst({
        where: { role: AdminRole.superAdmin, isDeleted: false },
      });
      if (superAdminExists) {
        throw new BadRequestException('SuperAdmin already exists. Only one SuperAdmin is allowed.');
      }
    }

    const password = await bcrypt.hash(dto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        username: dto.username,
        password,
        role: dto.role,
        phoneNumber: dto.phoneNumber,
        isActive: dto.isActive ?? true,
      },
    });

    console.log(admin);

    return new AdminResponseDto(admin);
  }

  async findAll(query: AdminQueryDto) {
    const { page = 1, limit = 10, search, role, isActive } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.AdminWhereInput = {
      isDeleted: false,
    };
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
      ];
    }
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    const [data, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.admin.count({ where }),
    ]);

    return {
      data: data.map((a) => new AdminResponseDto(a)),
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<AdminResponseDto> {
    const admin = await this.prisma.admin.findFirst({
      where: { id, isDeleted: false },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return new AdminResponseDto(admin);
  }

  async update(id: string, dto: UpdateAdminDto) {
    const admin = await this.prisma.admin.findFirst({
      where: { id, isDeleted: false },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role === AdminRole.superAdmin && dto.role === AdminRole.admin) {
      const count = await this.prisma.admin.count({
        where: { role: AdminRole.superAdmin, isDeleted: false },
      });
      if (count <= 1) {
        throw new BadRequestException('Cannot downgrade last super admin');
      }
    }
    if (dto.newPassword) {
      dto['password'] = await bcrypt.hash(dto.newPassword, 10);
      delete dto.newPassword;
    }
    const updated = await this.prisma.admin.update({
      where: { id },
      data: dto as Prisma.AdminUpdateInput,
    });

    return new AdminResponseDto(updated);
  }

  async remove(id: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException();
    if (admin.role === AdminRole.superAdmin) {
      const count = await this.prisma.admin.count({
        where: { role: AdminRole.superAdmin, isDeleted: false },
      });
      if (count <= 1) {
        throw new BadRequestException('Last super admin');
      }
    }

    await this.prisma.admin.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<AdminResponseDto> {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException();
    const restored = await this.prisma.admin.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });
    return new AdminResponseDto(restored);
  }

  async activate(id: string) {
    return this.prisma.admin.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    return this.prisma.admin.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async validateAdmin(dto: LoginAdminDto) {
    const admin = await this.prisma.admin.findFirst({
      where: { username: dto.username, isDeleted: false },
    });
    if (!admin || !admin.isActive) return null;

    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) return null;
    return admin;
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<AdminResponseDto> {
    const admin = await this.prisma.admin.findFirst({
      where: { id, isDeleted: false },
    });
    if (!admin) throw new NotFoundException('Admin not found');

    const valid = await bcrypt.compare(dto.currentPassword, admin.password);
    if (!valid) throw new UnauthorizedException('Wrong password');

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const password = await bcrypt.hash(dto.newPassword, 10);

    const updated = await this.prisma.admin.update({
      where: { id },
      data: { password },
    });

    return new AdminResponseDto(updated);
  }
}
