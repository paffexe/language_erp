
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationListResponseDto } from './dto/notification-list-response.dto';
import { FindNotificationsDto } from './dto/find-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification successfully created',
    type: NotificationResponseDto,
  })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get notifications with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications',
    type: NotificationListResponseDto,
  })
  findAll(@Query() query: FindNotificationsDto) {
    return this.notificationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Notification details',
    type: NotificationResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Notification updated',
    type: NotificationResponseDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return this.notificationService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a notification' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted notification' })
  restore(@Param('id') id: string) {
    return this.notificationService.restore(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a notification' })
  hardDelete(@Param('id') id: string) {
    return this.notificationService.hardDelete(id);
  }

  @Patch(':id/mark-sent')
  @ApiOperation({ summary: 'Mark notification as sent' })
  markAsSent(@Param('id') id: string) {
    return this.notificationService.markAsSent(id);
  }
}
