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

export class CreateTeacherDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsString()
  @MinLength(6)
  //   @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(50)
  cardNumber: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(TeacherSpecialty)
  specification?: TeacherSpecialty;

  @IsOptional()
  @IsEnum(TeacherLevel)
  level?: TeacherLevel;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  hourPrice?: number;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  portfolioLink?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  experience?: string;
}
