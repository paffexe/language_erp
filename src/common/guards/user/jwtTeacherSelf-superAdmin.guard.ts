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
    const bodyTeacherId = req.body.teacherId;
    // console.log('Body teacher id', bodyTeacherId);
    // console.log('Params id', paramId);
    console.log('data', admin);
    // console.log('params', req.params);
    console.log('full req', req);

    if (admin.role === 'superAdmin' || admin.role === 'admin') {
      return true;
    }

    if (admin.role === 'teacher' && admin.id === paramId) {
      console.log('on 2nd');
      return true;
    }

    if (admin.role === 'teacher' && admin.id === bodyTeacherId) {
      console.log('on 3rd');

      return true;
    }

    throw new ForbiddenException(
      "Siz faqat o'z profilingizni tahrirlashingiz mumkin",
    );
  }
}
