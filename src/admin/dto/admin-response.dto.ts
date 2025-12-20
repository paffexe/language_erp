import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AdminResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Admin ID' })
  id: string;

  @ApiProperty({ example: 'admin123', description: 'Username' })
  username: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: 'admin', description: 'Admin role' })
  role: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Is deleted' })
  isDeleted: boolean;

  @ApiPropertyOptional({ description: 'Deleted date' })
  deletedAt?: Date | null;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;

  constructor(partial: Partial<AdminResponseDto>) {
    Object.assign(this, partial);
  }
}