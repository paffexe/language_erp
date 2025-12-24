import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAccessTokenStrategy } from '../common/strategies/admin/admin-access-token-strategy';
import { AdminRefreshTokenStrategy } from '../common/strategies/admin/admin-refresh-token-strategy';
import { GoogleStrategy } from '../common/strategies/google.strategy';
import { SmsService } from '../common/services/sms.service';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [JwtModule.register({}), PrismaModule, TeacherModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminAccessTokenStrategy,
    AdminRefreshTokenStrategy,
    GoogleStrategy,
    SmsService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
