import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentQueryDto } from './dto/student-query.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import { RolesGuard } from '../common/guards/jwtRoles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, type: StudentResponseDto })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all students with search and pagination' })
  @ApiQuery({ type: StudentQueryDto })
  findAll(@Query() query: StudentQueryDto) {
    return this.studentService.findAll(query);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('teachers-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all teachers with search and pagination' })
  @ApiQuery({ type: StudentQueryDto })
  findTeachers(@Query() query: StudentQueryDto) {
    return this.studentService.findTeachers();
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a student' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/block')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Block a student' })
  block(@Param('id') id: string, @Body('reason') reason: string) {
    return this.studentService.block(id, reason);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/unblock')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unblock a student' })
  unblock(@Param('id') id: string) {
    return this.studentService.unblock(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore a soft deleted student' })
  restore(@Param('id') id: string) {
    return this.studentService.restore(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/hard')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a student' })
  hardDelete(@Param('id') id: string) {
    return this.studentService.hardDelete(id);
  }
}
