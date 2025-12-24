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

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, type: StudentResponseDto })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all students with search and pagination' })
  @ApiQuery({ type: StudentQueryDto })
  findAll(@Query() query: StudentQueryDto) {
    return this.studentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Block a student' })
  block(@Param('id') id: string, @Body('reason') reason: string) {
    return this.studentService.block(id, reason);
  }

  @Patch(':id/unblock')
  @ApiOperation({ summary: 'Unblock a student' })
  unblock(@Param('id') id: string) {
    return this.studentService.unblock(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft deleted student' })
  restore(@Param('id') id: string) {
    return this.studentService.restore(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a student' })
  hardDelete(@Param('id') id: string) {
    return this.studentService.hardDelete(id);
  }
}
