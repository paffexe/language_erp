import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class SoftDeleteNotificationDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Soft delete status of the notification',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean = true;
}
