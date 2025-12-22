import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonTemplateService } from './lesson-template.service';
import { CreateLessonTemplateDto } from './dto/create-lesson-template.dto';
import { UpdateLessonTemplateDto } from './dto/update-lesson-template.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Lesson Template')
@Controller('lesson-template')
export class LessonTemplateController {
  constructor(
    private readonly lessonTemplateService: LessonTemplateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create lesson template' })
  create(@Body() dto: CreateLessonTemplateDto) {
    return this.lessonTemplateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson templates' })
  findAll() {
    return this.lessonTemplateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson template by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.lessonTemplateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson template' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonTemplateDto,
  ) {
    return this.lessonTemplateService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete lesson template' })
  remove(@Param('id') id: string) {
    return this.lessonTemplateService.remove(id);
  }
}
