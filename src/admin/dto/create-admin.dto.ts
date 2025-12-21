import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { AdminRole } from '../../../generated/prisma/enums';

export class CreateAdminDto {
  @IsString()
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(AdminRole)
  role: AdminRole;

  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
