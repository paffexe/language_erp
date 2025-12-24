import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendOtpDto {
    @ApiProperty({ example: '+998901234567', description: 'Telefon raqam' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+998[0-9]{9}$/, { message: 'Telefon raqam formati noto\'g\'ri (+998XXXXXXXXX)' })
    phoneNumber: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '+998901234567', description: 'Telefon raqam' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+998[0-9]{9}$/, { message: 'Telefon raqam formati noto\'g\'ri (+998XXXXXXXXX)' })
    phoneNumber: string;

    @ApiProperty({ example: '123456', description: '6 xonali OTP kod' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{6}$/, { message: 'OTP 6 ta raqamdan iborat bo\'lishi kerak' })
    otp: string;
}
