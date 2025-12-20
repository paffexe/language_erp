// import {
//   IsEnum,
//   IsOptional,
//   IsUUID,
//   IsDateString,
//   IsInt,
//   Min,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { TransactionStatus } from './create-transaction.dto';

// export class FindTransactionsDto {
//   @ApiPropertyOptional({
//     description: 'Filter by lesson ID',
//     example: '123e4567-e89b-12d3-a456-426614174000',
//   })
//   @IsOptional()
//   @IsUUID()
//   lessonId?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by student ID',
//     example: '123e4567-e89b-12d3-a456-426614174001',
//   })
//   @IsOptional()
//   @IsUUID()
//   studentId?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by transaction status',
//     enum: TransactionStatus,
//     example: TransactionStatus.pending,
//   })
//   @IsOptional()
//   @IsEnum(TransactionStatus)
//   status?: TransactionStatus;

//   @ApiPropertyOptional({
//     description: 'Page number',
//     example: 1,
//     default: 1,
//   })
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @IsOptional()
//   page: number = 1;

//   @ApiPropertyOptional({
//     description: 'Items per page',
//     example: 10,
//     default: 10,
//   })
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @IsOptional()
//   limit: number = 10;

//   @ApiPropertyOptional({
//     description: 'Filter from performed time (ISO date)',
//     example: '2024-01-01T00:00:00Z',
//   })
//   @IsOptional()
//   @IsDateString()
//   performedTimeFrom?: string;

//   @ApiPropertyOptional({
//     description: 'Filter to performed time (ISO date)',
//     example: '2024-01-31T23:59:59Z',
//   })
//   @IsOptional()
//   @IsDateString()
//   performedTimeTo?: string;
// }


import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionStatus } from '../../../generated/prisma/enums';

export class FindTransactionsDto {
  @ApiPropertyOptional({
    description: 'Filter by lesson ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  lessonId?: string;

  @ApiPropertyOptional({
    description: 'Filter by student ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by transaction status',
    enum: TransactionStatus,
    example: TransactionStatus.pending,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Filter from performed time (ISO date)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  performedTimeFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter to performed time (ISO date)',
    example: '2024-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  performedTimeTo?: string;
}
