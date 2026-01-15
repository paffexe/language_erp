import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { AdminRole } from 'generated/prisma/enums';

export class AdminQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: AdminRole })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
