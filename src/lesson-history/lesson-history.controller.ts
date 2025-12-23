import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonHistoryService } from './lesson-history.service';
import { CreateLessonHistoryDto } from './dto/create-lesson-history.dto';
import { UpdateLessonHistoryDto } from './dto/update-lesson-history.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Lesson History')
@Controller('lesson-history')
export class LessonHistoryController {
  constructor(private readonly lessonHistoryService: LessonHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create lesson history (rating & feedback)' })
  create(@Body() dto: CreateLessonHistoryDto) {
    return this.lessonHistoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson histories' })
  findAll() {
    return this.lessonHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson history by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.lessonHistoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson history' })
  update(@Param('id') id: string, @Body() dto: UpdateLessonHistoryDto) {
    return this.lessonHistoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete lesson history' })
  remove(@Param('id') id: string) {
    return this.lessonHistoryService.remove(id);
  }
}
