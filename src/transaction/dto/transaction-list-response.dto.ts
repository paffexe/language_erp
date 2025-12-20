// import { ApiProperty } from '@nestjs/swagger';
// import { TransactionStatus } from './create-transaction.dto';

// export class TransactionListResponseDto {
//   @ApiProperty({ example: 'uuid' })
//   id: string;

//   @ApiProperty({ example: 'uuid' })
//   lessonId: string;

//   @ApiProperty({ example: 'uuid' })
//   studentId: string;

//   @ApiProperty({ example: 50000 })
//   price: number;

//   @ApiProperty({
//     enum: TransactionStatus,
//     example: TransactionStatus.pending,
//   })
//   status: TransactionStatus;

//   @ApiProperty({ example: null, nullable: true })
//   canceledTime: Date | null;

//   @ApiProperty({ example: null, nullable: true })
//   performedTime: Date | null;

//   @ApiProperty({ example: null, nullable: true })
//   reason: string | null;

//   @ApiProperty({ example: '2024-01-15T12:00:00.000Z' })
//   createdAt: Date;

//   @ApiProperty({ example: '2024-01-15T12:30:00.000Z' })
//   updatedAt: Date;
// }


import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../../generated/prisma/enums';

export class TransactionListResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  lessonId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  studentId: string;

  @ApiProperty({ example: 50000 })
  price: number;

  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  canceledTime: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  performedTime: Date | null;

  @ApiProperty({ nullable: true })
  reason: string | null;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time' })
  updatedAt: Date;
}

