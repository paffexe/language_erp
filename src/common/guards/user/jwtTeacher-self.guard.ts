import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsTeacherGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request | any = context.switchToHttp().getRequest();

    if (req.admin.id != req.params.id) {
      throw new ForbiddenException("Faqat shaxsiy malumotlar ko'rish mumkin");
    }

    return true;
  }
}
