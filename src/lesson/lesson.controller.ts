import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CombinedAuthGuard } from '../common/guards/both/jwtCombinedAuth.guard';
import { TeacherAuthGuard } from '../common/guards/user/jwtUser-auth.guard';
import { TeacherSelfOrSuperAdminGuard } from '../common/guards/user/jwtTeacherSelf-superAdmin.guard';

import { TeacherLessonCreateGuard } from 'src/common/guards/user/jwtTeacherLessonCreate.guard';
import { TeacherOwnsLessonOrAdminGuard } from 'src/common/guards/user/jwtTeacher-ownlessons.guard';
import { LessonQueryDto } from './dto/lesson-query.dto';

@ApiTags('Lesson')
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('lesson')
@ApiBearerAuth()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(TeacherAuthGuard, TeacherLessonCreateGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new lesson' })
  @ApiCreatedResponse({ description: 'Lesson created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @UseGuards(CombinedAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiOkResponse({ description: 'Lessons retrieved successfully' })
  findAll(@Query() query: LessonQueryDto) {
    return this.lessonService.findAll(query);
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonService.findOne(id);
  }

  @UseGuards(CombinedAuthGuard, TeacherOwnsLessonOrAdminGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lesson' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(id, dto);
  }

  @UseGuards(CombinedAuthGuard, TeacherOwnsLessonOrAdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete lesson (soft delete)' })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonService.remove(id);
  }
  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Get(':id/teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lessons by id for teacher' })
  @ApiParam({ name: 'id', type: String })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  findAllbyTeacher(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Query() query: LessonQueryDto,
  ) {
    return this.lessonService.findAllByTeacher(id, query);
  }
}
