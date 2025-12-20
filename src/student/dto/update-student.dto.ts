import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @ApiPropertyOptional({ example: false, description: 'Block student' })
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;

  @ApiPropertyOptional({
    example: 'Violated terms',
    description: 'Reason for blocking',
  })
  @IsString()
  @IsOptional()
  blockedReason?: string;
}
