import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/jwtRoles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TeacherSelfOrSuperAdminGuard } from '../common/guards/user/jwtTeacherSelf-superAdmin.guard';
import { TeacherAuthGuard } from '../common/guards/user/jwtUser-auth.guard';
import { CombinedAuthGuard } from '../common/guards/both/jwtCombinedAuth.guard';

@ApiTags('teacher')
@ApiBearerAuth()
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({
    status: 201,
    description: 'The teacher has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiBody({ type: CreateTeacherDto })
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  ///////
  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({
    status: 200,
    description: 'Returns all teachers successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Admin access required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions.',
  })
  @ApiSecurity('JWT-admin-auth')
  findAll() {
    return this.teacherService.findAll();
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the teacher successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found.',
  })
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found.',
  })
  @ApiBody({ type: UpdateTeacherDto })
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The teacher has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found.',
  })
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Patch(':id/update-password')
  @ApiOperation({ summary: 'Update teacher password' })
  @ApiParam({
    name: 'id',
    description: 'Teacher ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found.',
  })
  @ApiBody({ type: UpdatePasswordDto })
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    return this.teacherService.updatePassword(id, dto);
  }
}
