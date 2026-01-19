import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { TransactionStatus } from 'generated/prisma/enums';

export class TransactionQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'lesson-uuid' })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ example: 'student-uuid' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ enum: TransactionStatus })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  performedTimeFrom?: Date;

  @ApiPropertyOptional({ example: '2026-01-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  performedTimeTo?: Date;
}
