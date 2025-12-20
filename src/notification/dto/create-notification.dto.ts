// create-notification.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'a3f1c2e4-9b7d-4a2a-8e3b-123456789abc',
    description: 'Student ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    example: 'b1d2e3f4-5678-4c9a-9f00-abcdef123456',
    description: 'Lesson ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    example: 'Class schedule has been updated',
    description: 'Notification message',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '2025-12-20T10:00:00.000Z',
    description: 'Notification send time',
  })
  @IsDate()
  @IsNotEmpty()
  sendAt: Date;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isSend?: boolean;
}
