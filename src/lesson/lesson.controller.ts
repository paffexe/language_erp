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
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Lesson')
@UseGuards(RolesGuard)
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles("teacher")
  @ApiOperation({ summary: 'Create new lesson' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Get()
  @Roles("teacher")
  @ApiResponse({ status: 403, description: 'Avtorizatsiya talab qilinadi' })
  @ApiOperation({ summary: 'Get all lessons' })
  findAll() {
    return this.lessonService.findAll();
  }
  
  @Get(':id')
  @Roles("teacher")
  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson' })
  @Roles("teacher")
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonService.update(id, dto);
  }
  
  @Delete(':id')
  @Roles("teacher")
  @ApiOperation({ summary: 'Delete lesson (soft delete)' })
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
