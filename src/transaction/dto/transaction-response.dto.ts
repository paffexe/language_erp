// import { ApiProperty } from '@nestjs/swagger';
// import { TransactionStatus } from './create-transaction.dto';

// export class TransactionResponseDto {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   lessonId: string;

//   @ApiProperty()
//   studentId: string;

//   @ApiProperty({ example: 50000 })
//   price: number;

//   @ApiProperty({ enum: TransactionStatus })
//   status: TransactionStatus;

//   @ApiProperty({ nullable: true })
//   canceledTime: Date | null;

//   @ApiProperty({ nullable: true })
//   performedTime: Date | null;

//   @ApiProperty({ nullable: true })
//   reason: string | null;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }


import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../../../generated/prisma/enums';


export class TransactionResponseDto {
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
