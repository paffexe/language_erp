import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty({ example: 'admin123', description: 'Admin username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Admin password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
