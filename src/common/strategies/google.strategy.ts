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
