import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateLessonTemplateDto {
  @ApiProperty()
  @IsUUID()
  teacherId: string;

  @ApiProperty({ example: 'Morning English Lesson' })
  @IsString()
  name: string;

  @ApiProperty({ example: '10:00 - 11:00' })
  @IsString()
  timeSlot: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
