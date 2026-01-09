import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelTeacherPaymentDto {
  @ApiProperty({
    description: 'User ID who canceled the payment',
    example: 'admin-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  canceledBy: string;

  @ApiProperty({
    description: 'Reason for cancellation',
    example: 'Lesson was rescheduled',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  canceledReason: string;
}
