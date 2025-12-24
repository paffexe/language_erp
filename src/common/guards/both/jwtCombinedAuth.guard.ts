import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized user');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      if (!payload.is_active) {
        throw new UnauthorizedException(
          "You're not an active user! Please activate your account",
        );
      }

      req.admin = payload;
      return true;
    } catch (adminError) {}

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY, // Teacher secret
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      if (!payload.is_active) {
        throw new UnauthorizedException(
          "You're not an active user! Please activate your account",
        );
      }

      req.admin = payload;
      return true;
    } catch (teacherError) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
