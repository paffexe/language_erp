import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminSelfOrSuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const paramId = req.params.id;
    const admin = req.admin;

    if (admin.role === 'superAdmin') {
      return true;
    }

    if (admin.id === paramId) {
      return true;
    }

    throw new ForbiddenException(
      "Siz faqat o'z profilingizni tahrirlashingiz mumkin",
    );
  }
}
