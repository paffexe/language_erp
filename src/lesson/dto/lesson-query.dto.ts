import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { LessonStatus } from 'generated/prisma/enums';

export class LessonQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: LessonStatus })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @ApiPropertyOptional({ example: 'teacher-uuid' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ example: 'student-uuid' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2026-01-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
