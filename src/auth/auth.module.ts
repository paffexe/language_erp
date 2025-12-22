import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessTokenStrategy } from '../common/strategies/access-token-strategy';
import { RefreshTokenCookieStrategy } from '../common/strategies/refresh-token-strategy';

@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenCookieStrategy],
  exports: [AuthService],
})
export class AuthModule { }
