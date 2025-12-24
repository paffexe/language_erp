import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        const { id, emails, displayName, photos } = profile;

        // Email mavjudligini tekshirish
        if (!emails || emails.length === 0) {
            done(new Error('Email topilmadi'), false);
            return;
        }

        const user = {
            googleId: id,
            email: emails[0].value,
            fullName: displayName || 'Unknown',
            imageUrl: photos?.[0]?.value,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
        };

        done(null, user);
    }
}
