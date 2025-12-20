import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Doe', description: 'Student last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'John', description: 'Student first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Student phone number',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456789', description: 'Telegram ID' })
  @IsString()
  @IsNotEmpty()
  tgId: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Telegram username' })
  @IsString()
  @IsOptional()
  tgUsername?: string;

  @ApiPropertyOptional({ example: true, description: 'Is student active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
