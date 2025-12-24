import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AdminService } from './admin.service';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import { RolesGuard } from '../common/guards/jwtRoles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminSelfOrSuperAdminGuard } from '../common/guards/jwtAdminSelf-superAdmin.guard';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create admin' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admins list' })
  findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @UseGuards(AdminAuthGuard, AdminSelfOrSuperAdminGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID' })
  findOne(@Param('id') id: string) {
    const admin = this.adminService.findOne(id);
    return {
      message: 'Admin found',
      data: admin,
    };
  }

  @UseGuards(AdminAuthGuard, AdminSelfOrSuperAdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin' })
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard, AdminSelfOrSuperAdminGuard)
  @Patch(':id/change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change admin password' })
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.adminService.changePassword(id, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login (validate)' })
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.validateAdmin(dto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Patch(':id/activate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate admin' })
  activate(@Param('id') id: string) {
    return this.adminService.activate(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Patch(':id/deactivate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate admin' })
  deactivate(@Param('id') id: string) {
    return this.adminService.deactivate(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete admin' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('superAdmin')
  @Patch(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore deleted admin' })
  restore(@Param('id') id: string) {
    return this.adminService.restore(id);
  }
}
