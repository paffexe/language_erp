import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherPaymentDto {
  @ApiProperty({
    description: 'ID of the teacher receiving the payment',
    example: '4e1cb22f-aa5c-4568-a346-685565ba78ec',
    maxLength: 255,
  })
  @IsString()
  teacherId: string;

  @ApiProperty({
    description: 'ID of the lesson associated with this payment',
    example: 'clx2b3c4d5e6f7g8h9i0j1k',
    maxLength: 255,
  })
  @IsString()
  lessonId: string;

  @ApiProperty({
    description:
      'Total amount for the lesson (in smallest currency unit, e.g., cents)',
    example: 5000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  totalLessonAmount: number;

  @ApiProperty({
    description: 'Platform commission amount (in smallest currency unit)',
    example: 500,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  platformComission: number;

  @ApiProperty({
    description: 'Platform commission percentage or fixed amount',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  platformAmount: number;

  @ApiProperty({
    description: 'Amount received by the teacher (in smallest currency unit)',
    example: 4500,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  teacherAmount: number;

  @ApiProperty({
    description: 'Person or entity who made the payment',
    example: 'Student Name',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  paidBy: string;

  @ApiProperty({
    description: 'Date and time when payment was made (ISO 8601 format)',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  paidAt: string;

  @ApiPropertyOptional({
    description: 'Whether the payment has been canceled',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCanceled?: boolean;

  @ApiPropertyOptional({
    description: 'Date and time when payment was canceled (ISO 8601 format)',
    example: '2024-01-16T14:20:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  canceledAt?: string;

  @ApiPropertyOptional({
    description: 'Person or entity who canceled the payment',
    example: 'Admin Name',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  canceledBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for payment cancellation',
    example: 'Lesson was rescheduled',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  canceledReason?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the payment',
    example:
      'Payment processed via Stripe, Transaction ID: ch_1A2B3C4D5E6F7G8H9I0J',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
