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

@ApiTags('Lesson')
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('lesson')
@ApiBearerAuth()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(TeacherAuthGuard)
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
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiOkResponse({ description: 'Lessons retrieved successfully' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    return this.lessonService.findAll().then((res) => {
      const paginatedLessons = res.lessons.slice(startIndex, endIndex);

      return {
        statusCode: 200,
        message: 'Lessons retrieved successfully',
        count: res.count,
        page: pageNum,
        limit: limitNum,
        lessons: paginatedLessons,
      };
    });
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

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lesson' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(id, dto);
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete lesson (soft delete)' })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonService.remove(id);
  }
}
