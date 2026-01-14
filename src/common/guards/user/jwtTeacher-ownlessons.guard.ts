import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TeacherOwnsLessonOrAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { id: lessonId } = req.params;
    const admin = req.admin;

    // Admins can do anything
    if (admin.role === 'superAdmin' || admin.role === 'admin') {
      return true;
    }

    if (admin.role !== 'teacher') {
      throw new ForbiddenException('Access denied');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { teacherId: true },
    });

    if (!lesson) {
      throw new ForbiddenException('Lesson not found');
    }

    if (lesson.teacherId !== admin.id) {
      throw new ForbiddenException(
        "Siz faqat o'zingizga tegishli darsni tahrirlashingiz mumkin",
      );
    }

    return true;
  }
}
