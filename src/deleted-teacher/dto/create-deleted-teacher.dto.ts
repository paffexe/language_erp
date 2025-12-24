import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeletedTeacherDto {
  @ApiProperty({
    description: 'ID of the teacher being deleted/archived',
    example: 'any uuid string',
    maxLength: 255,
  })
  @IsString()
  teacherId: string;

  @ApiProperty({
    description: 'Username or ID of the person/admin performing the deletion',
    example: 'uuid of the admin',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  deletedBy: string;

  @ApiProperty({
    description: 'Reason for deleting/archiving the teacher account',
    example: 'Teacher requested account deletion',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  reason: string;

  @ApiPropertyOptional({
    description:
      'Planned restoration date (if temporary deletion) - ISO 8601 format',
    example: '2024-06-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  restoreAt?: string;
}
