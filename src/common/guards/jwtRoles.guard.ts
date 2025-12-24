import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Role hierarchy: higher number = more permissions
  private readonly roleHierarchy: Record<string, number> = {
    superAdmin: 3,
    admin: 2,
    teacher: 1,
  };

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Check req.admin since that's where your auth guards store the user
    if (!request.admin || !request.admin.role) {
      throw new ForbiddenException('Foydalanuvchi autentifikatsiya qilinmagan');
    }

    const userRole = request.admin.role;
    const userRoleLevel = this.roleHierarchy[userRole];

    // If user role is not in hierarchy, deny access
    if (userRoleLevel === undefined) {
      throw new ForbiddenException("Noto'g'ri rol");
    }

    // Find the minimum required role level
    // superAdmin can access everything, admin can access admin+teacher, teacher only teacher
    const minRequiredLevel = Math.min(
      ...requiredRoles.map((role) => this.roleHierarchy[role] ?? Infinity),
    );

    // Check if user's role level meets or exceeds the minimum required level
    if (userRoleLevel >= minRequiredLevel) {
      return true;
    }

    throw new ForbiddenException(
      `Kirish rad etildi. Kerakli rollar: ${requiredRoles.join(', ')}`,
    );
  }
}
