import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  Min,
  MaxLength,
  IsEnum,
  MinLength,
  Max,
  IsStrongPassword,
} from 'class-validator';
import {
  TeacherLevel,
  TeacherSpecialty,
} from '../../../generated/prisma/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Teacher email address',
    example: 'teacher@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Teacher phone number',
    example: '+1234567890',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({
    description: 'Full name of the teacher',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    description: 'Account password (minimum 6 characters)',
    example: 'StrongPassword123!',
    minLength: 6,
    // Note: Uncomment @IsStrongPassword() for stricter validation
  })
  @IsString()
  @MinLength(6)
  // @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'To make sure the password is correct(minimum 6 characters)',
    example: 'StrongPassword123!',
    minLength: 6,
    // Note: Uncomment @IsStrongPassword() for stricter validation
  })
  @IsString()
  @MinLength(6)
  // @IsStrongPassword()
  confirm_password: string;

  @ApiProperty({
    description: 'Teacher card number or identification',
    example: 'TCH-001',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  cardNumber: string;

  @ApiPropertyOptional({
    description: 'Whether the teacher account is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Teaching specialty/language',
    enum: TeacherSpecialty,
    example: TeacherSpecialty.english,
  })
  @IsOptional()
  @IsEnum(TeacherSpecialty)
  specification?: TeacherSpecialty;

  @ApiPropertyOptional({
    description: 'Teacher proficiency level',
    enum: TeacherLevel,
    example: TeacherLevel.c1,
  })
  @IsOptional()
  @IsEnum(TeacherLevel)
  level?: TeacherLevel;

  @ApiPropertyOptional({
    description: 'Teacher biography or description',
    example: 'Experienced English teacher with 5 years of teaching...',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Hourly teaching rate (must be positive)',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  hourPrice?: number;

  @ApiPropertyOptional({
    description: 'Link to teacher portfolio',
    example: 'https://portfolio.example.com/johndoe',
    maxLength: 500,
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  portfolioLink?: string;

  @ApiPropertyOptional({
    description: 'Link to teacher profile image',
    example: 'https://example.com/images/johndoe.jpg',
    maxLength: 500,
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Teacher rating (0-5)',
    example: 1,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Teaching experience description',
    example: '5 years of teaching experience',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  experience?: string;

  @ApiProperty({
    description: 'Unique Google ID for the teacher',
    example: '1',
  })
  @IsString()
  googleId: string;
}
