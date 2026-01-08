import {
  ExecutionContext,
  Injectable,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TeacherLessonCreateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const admin = req.admin;
    const bodyTeacherId = req.body.teacherId;

    if (admin.role === 'teacher' && admin.id === bodyTeacherId) {
      return true;
    }

    throw new ForbiddenException(
      "Siz faqat o'z darslaringizni yaratishingiz mumkin",
    );
  }
}
