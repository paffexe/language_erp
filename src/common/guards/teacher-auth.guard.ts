import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TeacherAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Token topilmadi');
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Noto\'g\'ri token formati');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.ACCESS_TOKEN_KEY,
            });

            if (!payload.is_active) {
                throw new UnauthorizedException('Akkaunt faol emas');
            }

            req.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Token yaroqsiz');
        }
    }
}
