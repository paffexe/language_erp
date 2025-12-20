// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsDateString,
//   IsEnum,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
//   IsUUID,
// } from 'class-validator';

// export enum TransactionStatus {
//   pending = 'pending',
//   paid = 'paid',
//   cancelled = 'cancelled',
// }

// export class CreateTransactionDto {
//   @ApiProperty({ example: 'uuid' })
//   @IsUUID()
//   @IsNotEmpty()
//   lessonId: string;

//   @ApiProperty({ example: 'uuid' })
//   @IsUUID()
//   @IsNotEmpty()
//   studentId: string;

//   @ApiProperty({ example: 50000 })
//   @IsNumber()
//   price: number;

//   @ApiProperty({ enum: TransactionStatus })
//   @IsEnum(TransactionStatus)
//   status: TransactionStatus;

//   @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
//   @IsOptional()
//   @IsDateString()
//   canceledTime?: string;

//   @ApiPropertyOptional({ example: '2024-01-15T14:00:00Z' })
//   @IsOptional()
//   @IsDateString()
//   performedTime?: string;

//   @ApiPropertyOptional({ example: 'Monthly payment' })
//   @IsOptional()
//   @IsString()
//   reason?: string;
// }


import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionStatus } from '../../../generated/prisma/enums';

export class CreateTransactionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    enum: TransactionStatus,
    default: TransactionStatus.pending,
    description: 'Transaction status',
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @ApiPropertyOptional({
    example: '2024-01-15T10:00:00Z',
    description: 'Cancellation time (ISO date)',
  })
  @IsOptional()
  @IsDateString()
  canceledTime?: string;

  @ApiPropertyOptional({
    example: '2024-01-15T14:00:00Z',
    description: 'Performed time (ISO date)',
  })
  @IsOptional()
  @IsDateString()
  performedTime?: string;

  @ApiPropertyOptional({ example: 'Monthly payment', description: 'Reason' })
  @IsOptional()
  @IsString()
  reason?: string;
}
