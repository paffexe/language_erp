import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '../../../generated/prisma/enums';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin123', description: 'Admin username' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Admin password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiProperty({
    enum: AdminRole,
    example: AdminRole.admin,
    description: 'Admin role',
  })
  @IsEnum(AdminRole)
  role: AdminRole;

  @ApiProperty({ example: '+998901234567', description: 'Admin phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  isActive: boolean

}
