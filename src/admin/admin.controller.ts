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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AdminService } from './admin.service';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create admin' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get admins list' })
  findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin' })
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  @Patch(':id/change-password')
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

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate admin' })
  activate(@Param('id') id: string) {
    return this.adminService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate admin' })
  deactivate(@Param('id') id: string) {
    return this.adminService.deactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete admin' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted admin' })
  restore(@Param('id') id: string) {
    return this.adminService.restore(id);
  }
}
