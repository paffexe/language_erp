import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum LessonStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @ApiPropertyOptional({
    enum: LessonStatus,
    example: LessonStatus.BOOKED,
  })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;
}
