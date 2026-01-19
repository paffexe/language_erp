import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Student ID' })
  id: string;

  @ApiProperty({ example: 'LastName', description: 'Last name' })
  lastName: string;

  @ApiProperty({ example: 'FirstName', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: 'student', description: 'Role' })
  role: string;

  @ApiPropertyOptional({ example: 'tg-123456', description: 'Telegram ID' })
  tgId: string | null;

  @ApiPropertyOptional({
    example: 'username',
    description: 'Telegram username',
  })
  tgUsername: string | null;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Is blocked' })
  isBlocked: boolean;

  @ApiPropertyOptional({ description: 'Blocked date' })
  blockedAt: Date | null;

  @ApiPropertyOptional({ description: 'Blocked reason' })
  blockedReason: string | null;

  @ApiProperty({ example: false, description: 'Is deleted' })
  isDeleted: boolean;

  @ApiPropertyOptional({ description: 'Deleted date' })
  deletedAt: Date | null;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;

  constructor(partial: Partial<StudentResponseDto>) {
    Object.assign(this, partial);
  }
}
