import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TeacherResponseDto {
  @ApiProperty({ example: 'teacher is found' })
  message: string;

  @ApiProperty({ example: 'uuid', description: 'Teacher ID' })
  id: string;

  @ApiProperty({ example: 'teacher@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  fullName: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: '8600000000000001', description: 'Card number' })
  cardNumber: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Is deleted' })
  isDeleted: boolean;

  @ApiPropertyOptional({ description: 'Deleted date' })
  deletedAt: Date | null;

  @ApiProperty({ example: 'teacher', description: 'Role' })
  role: string;

  @ApiProperty({ example: 'french', description: 'Specification' })
  specification: string;

  @ApiProperty({ example: 'c1', description: 'Level' })
  level: string;

  @ApiPropertyOptional({
    example: 'Experienced teacher',
    description: 'Description',
  })
  description: string | null;

  @ApiPropertyOptional({ example: 60000, description: 'Hour price' })
  hourPrice: number | null;

  @ApiPropertyOptional({ description: 'Portfolio link' })
  portfolioLink: string | null;

  @ApiPropertyOptional({ description: 'Image URL' })
  imageUrl: string | null;

  @ApiPropertyOptional({ description: 'Google ID' })
  googleId: string;

  @Exclude()
  googleRefreshToken: string | null;

  @Exclude()
  googleAccessToken: string | null;

  @ApiPropertyOptional({ example: 4, description: 'Rating' })
  rating: number | null;

  @ApiPropertyOptional({ example: '4 years', description: 'Experience' })
  experience: string | null;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;

  constructor(partial: Partial<TeacherResponseDto>) {
    Object.assign(this, partial);
  }
}
