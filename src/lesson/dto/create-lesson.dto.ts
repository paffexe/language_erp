// dto/create-lesson.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-01-01T11:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty()
  @IsUUID()
  teacherId: string;

  @ApiProperty()
  @IsUUID()
  studentId: string;

  @IsOptional()
  googleMeetsUrl?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
