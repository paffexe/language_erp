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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeacherAuthGuard } from '../common/guards/user/jwtUser-auth.guard';
import { CombinedAuthGuard } from '../common/guards/both/jwtCombinedAuth.guard';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import { RolesGuard } from '../common/guards/jwtRoles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TeacherSelfOrSuperAdminGuard } from '../common/guards/user/jwtTeacherSelf-superAdmin.guard';

@ApiTags('Lesson Template')
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('lesson-template')
export class LessonTemplateController {
  constructor(private readonly lessonTemplateService: LessonTemplateService) {}

  @UseGuards(TeacherAuthGuard)
  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create lesson template' })
  @ApiCreatedResponse({ description: 'Lesson template created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() dto: CreateLessonTemplateDto) {
    return this.lessonTemplateService.create(dto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all lesson templates' })
  @ApiOkResponse({ description: 'Lesson templates retrieved successfully' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
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

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Get(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lesson template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiNotFoundResponse({ description: 'Lesson template not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonTemplateService.findOne(id);
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lesson template' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonTemplateDto,
  ) {
    return this.lessonTemplateService.update(id, dto);
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete lesson template' })
  @ApiNotFoundResponse({ description: 'Lesson template not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonTemplateService.remove(id);
  }
}
