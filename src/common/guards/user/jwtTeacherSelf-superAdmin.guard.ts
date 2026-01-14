import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TeacherSelfOrSuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const paramId = req.params.id;
    const admin = req.admin;

    if (admin.role === 'superAdmin' || admin.role === 'admin') {
      return true;
    }

    if (admin.role === 'teacher' && admin.id === paramId) {
      return true;
    }

    throw new ForbiddenException(
      "Siz faqat o'z profilingizni tahrirlashingiz mumkin",
    );
  }
}
