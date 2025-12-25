import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LessonService } from '../../../lesson/lesson.service';

@Injectable()
export class TeacherLessonOwnerGuard implements CanActivate {
  constructor(private readonly lessonsService: LessonService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const admin = req.admin;

    if (admin.role === 'superAdmin' || admin.role === 'admin') {
      return true;
    }

    if (admin.role === 'teacher') {
      const lessons = await this.lessonsService.findAllbyTeacher(admin.id);

      if (lessons && lessons.lessons.length > 0) {
        return true;
      }
    }

    throw new ForbiddenException(
      "Sizda ushbu amalni bajarish uchun huquq yo'q yoki darslar topilmadi",
    );
  }
}
