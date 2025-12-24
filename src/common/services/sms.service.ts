import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
        try {
            // +998 ni olib tashlash (Eskiz 998XXXXXXXXX formatini kutadi)
            const cleanPhone = phoneNumber.replace('+', '');

            const message = process.env.SMS_TEMPLATE?.replace('{otp}', otp)
                || `Sizning tasdiqlash kodingiz: ${otp}`;

            const response = await axios.post(
                process.env.SMS_SERVICE_URL!,
                {
                    mobile_phone: cleanPhone,
                    message: message,
                    from: '4546',
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.data?.status === 'waiting' || response.data?.id) {
                this.logger.log(`OTP yuborildi: ${phoneNumber}`);
                return true;
            }

            this.logger.error(`SMS yuborishda xatolik: ${JSON.stringify(response.data)}`);
            return false;
        } catch (error) {
            this.logger.error(`SMS service xatolik: ${error.message}`);
            return false;
        }
    }

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
