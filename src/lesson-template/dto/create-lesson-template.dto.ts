import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean, IsOptional, IsNumber, IsIn, Min } from 'class-validator';

export class CreateLessonTemplateDto {
  @ApiProperty({ description: 'Teacher UUID' })
  @IsUUID()
  teacherId: string;

  @ApiProperty({ example: 'Morning English Lesson' })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 60, 
    description: 'Duration in minutes',
    enum: [30, 45, 60, 90, 120]
  })
  @IsNumber()
  @IsIn([30, 45, 60, 90, 120])
  durationMinutes: number;

  @ApiProperty({ 
    example: 50000, 
    description: 'Price in smallest currency unit (e.g., cents)' 
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    required: false, 
    example: 'Introduction to English grammar and conversation practice' 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}