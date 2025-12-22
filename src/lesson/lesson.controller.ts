import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @ApiOperation({ summary: 'Create new lesson' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson (soft delete)' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
