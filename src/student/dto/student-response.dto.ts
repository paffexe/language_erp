import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Student ID' })
  id: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: 'student', description: 'User role' })
  role: string;

  @ApiProperty({ example: '123456789', description: 'Telegram ID' })
  tgId: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Telegram username' })
  tgUsername?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Is blocked' })
  isBlocked: boolean;

  @ApiPropertyOptional({ description: 'Blocked date' })
  blockedAt?: Date;

  @ApiPropertyOptional({
    example: 'Violated terms',
    description: 'Block reason',
  })
  blockedReason?: string;

  @ApiProperty({ example: false, description: 'Is deleted' })
  isDeleted: boolean;

  @ApiPropertyOptional({ description: 'Deleted date' })
  deletedAt?: Date;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;
}
