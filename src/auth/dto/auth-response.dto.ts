import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;

    @ApiProperty({ example: 'uuid-string' })
    id: string;

    @ApiProperty({ example: 'admin' })
    role: string;

    @ApiProperty({ example: 'Login successful' })
    message: string;
}

export class LogoutResponseDto {
    @ApiProperty({ example: 'Logged out successfully' })
    message: string;
}

export class RefreshResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;

    @ApiProperty({ example: 'Token refreshed successfully' })
    message: string;
}
