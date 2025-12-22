// dto/create-lesson-history.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLessonHistoryDto {
  @ApiProperty()
  @IsUUID()
  lessonId: string;

  @ApiProperty({ example: 5, description: 'Rating (1–5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty()
  @IsUUID()
  teacherId: string;

  @ApiProperty()
  @IsUUID()
  studentId: string;
}
