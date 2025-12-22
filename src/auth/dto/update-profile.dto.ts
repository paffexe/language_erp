import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminProfileDto {
    @ApiPropertyOptional({ example: 'newusername' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    username?: string;

    @ApiPropertyOptional({ example: '+998901234567' })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}

export class UpdateTeacherProfileDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: '+998901234567' })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional({ example: 'Experienced English teacher' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'https://portfolio.com/john' })
    @IsOptional()
    @IsString()
    portfolioLink?: string;

    @ApiPropertyOptional({ example: '5 years' })
    @IsOptional()
    @IsString()
    experience?: string;
}
