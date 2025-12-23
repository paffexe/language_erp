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
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LessonTemplateService } from './lesson-template.service';
import { CreateLessonTemplateDto } from './dto/create-lesson-template.dto';
import { UpdateLessonTemplateDto } from './dto/update-lesson-template.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Lesson Template')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(RolesGuard)
@Controller('lesson-template')
export class LessonTemplateController {
  constructor(private readonly lessonTemplateService: LessonTemplateService) {}

  @Post()
  @Roles('teacher')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create lesson template' })
  @ApiCreatedResponse({ description: 'Lesson template created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() dto: CreateLessonTemplateDto) {
    return this.lessonTemplateService.create(dto);
  }

@Get()
@Roles('teacher')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Get all lesson templates' })
@ApiOkResponse({ description: 'Lesson templates retrieved successfully' })
findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  // page va limit raqamlarini integerga o‘tkazamiz
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  return this.lessonTemplateService.findAll().then((res) => {
    const paginatedTemplates = res.templates.slice(startIndex, endIndex);

    return {
      statusCode: 200,
      message: 'Lesson templates retrieved successfully',
      count: res.count,
      page: pageNum,
      limit: limitNum,
      templates: paginatedTemplates,
    };
  });
}


  @Get(':id')
  @Roles('teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lesson template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiNotFoundResponse({ description: 'Lesson template not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonTemplateService.findOne(id);
  }

  @Patch(':id')
  @Roles('teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lesson template' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonTemplateDto,
  ) {
    return this.lessonTemplateService.update(id, dto);
  }

  @Delete(':id')
  @Roles('teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete lesson template' })
  @ApiNotFoundResponse({ description: 'Lesson template not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonTemplateService.remove(id);
  }
}
