import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline', // Critical for Meet links
      prompt: 'consent', // Ensures you get the refresh token every time during testing
    };
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
