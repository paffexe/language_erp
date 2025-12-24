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
import { LessonHistoryService } from './lesson-history.service';
import { CreateLessonHistoryDto } from './dto/create-lesson-history.dto';
import { UpdateLessonHistoryDto } from './dto/update-lesson-history.dto';
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
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';

@ApiTags('Lesson History')
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('lesson-history')
export class LessonHistoryController {
  constructor(private readonly lessonHistoryService: LessonHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create lesson history (rating & feedback)' })
  @ApiCreatedResponse({ description: 'Lesson history created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() dto: CreateLessonHistoryDto) {
    return this.lessonHistoryService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all lesson histories with pagination' })
  @ApiOkResponse({ description: 'Lesson histories retrieved successfully' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    return this.lessonHistoryService.findAll().then((res) => {
      const paginatedHistories = res.histories.slice(skip, skip + limitNum);
      return {
        statusCode: 200,
        message: 'Lesson histories retrieved successfully',
        count: res.count,
        page: pageNum,
        limit: limitNum,
        histories: paginatedHistories,
      };
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get lesson history by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiNotFoundResponse({ description: 'Lesson history not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonHistoryService.findOne(id);
  }

  @UseGuards(CombinedAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update lesson history' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonHistoryDto,
  ) {
    return this.lessonHistoryService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete lesson history' })
  @ApiNotFoundResponse({ description: 'Lesson history not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonHistoryService.remove(id);
  }
}
