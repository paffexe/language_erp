import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqam' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998[0-9]{9}$/, {
    message: "Telefon raqam formati noto'g'ri (+998XXXXXXXXX)",
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description:
      'Parol (kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Parol kamida 1 ta katta harf, 1 ta kichik harf va 1 ta raqamdan iborat bo\'lishi kerak',
  })
  password: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Parolni tasdiqlash (password bilan bir xil bo\'lishi kerak)',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqam' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998[0-9]{9}$/, {
    message: "Telefon raqam formati noto'g'ri (+998XXXXXXXXX)",
  })
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: '6 xonali OTP kod' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, { message: "OTP 6 ta raqamdan iborat bo'lishi kerak" })
  otp: string;
}
