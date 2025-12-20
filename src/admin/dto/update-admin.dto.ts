import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto extends PartialType(
  OmitType(CreateAdminDto, ['password'] as const),
) {
  @ApiPropertyOptional({ example: 'NewSecurePass123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}
