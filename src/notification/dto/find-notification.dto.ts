// find-notification.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FindNotificationsDto {
  @ApiPropertyOptional({ example: 'a3f1c2e4-9b7d-4a2a-8e3b-123456789abc' })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({ example: 'b1d2e3f4-5678-4c9a-9f00-abcdef123456' })
  @IsOptional()
  @IsUUID()
  lessonId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSend?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDeleted?: boolean;

  @ApiPropertyOptional({ example: '2025-12-01T00:00:00.000Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sendAtFrom?: Date;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sendAtTo?: Date;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
