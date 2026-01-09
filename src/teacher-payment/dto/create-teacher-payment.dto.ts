import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateTeacherPaymentDto {
  @ApiProperty({
    description: 'Teacher ID',
    example: '4e1cb22f-aa5c-4568-a346-685565ba78ec',
  })
  @IsString()
  teacherId: string;

  @ApiProperty({
    description: 'Lesson ID',
    example: 'clx2lesson123',
  })
  @IsString()
  lessonId: string;

  @ApiProperty({
    description: 'Total lesson price',
    example: 5000,
  })
  @IsInt()
  @Min(0)
  totalLessonAmount: number;

  @ApiProperty({
    description: 'Platform commission percentage',
    example: 10,
  })
  @IsInt()
  @Min(0)
  platformComission: number;

  @ApiProperty({
    description: 'Platform commission amount',
    example: 500,
  })
  @IsInt()
  @Min(0)
  platformAmount: number;

  @ApiProperty({
    description: 'Teacher payout amount',
    example: 4500,
  })
  @IsInt()
  @Min(0)
  teacherAmount: number;

  @ApiProperty({
    description: 'Who made the payment',
    example: 'Student',
  })
  @IsString()
  paidBy: string;

  // @ApiPropertyOptional({
  //   description: 'Payment date (ISO). Defaults to current date/time if not provided.',
  //   example: '2024-01-15T10:30:00.000Z',
  // })
  // @IsOptional()
  // @IsDateString()
  // paidAt?: string;

  @ApiPropertyOptional({
    description: 'Whether the payment is canceled',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCanceled?: boolean;

  @ApiPropertyOptional({
    description: 'Cancellation date (ISO)',
    example: '2024-01-16T14:20:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => o.isCanceled === true)
  canceledAt?: string;

  @ApiPropertyOptional({
    description: 'ID of the user who canceled the payment',
    example: 'admin-uuid-123',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isCanceled === true)
  canceledBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for cancellation',
    example: 'Lesson was rescheduled',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isCanceled === true)
  canceledReason?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Paid via cash',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}