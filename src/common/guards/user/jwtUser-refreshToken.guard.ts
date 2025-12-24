import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserRefreshTokenGuard extends AuthGuard('user-refresh-jwt') {
  constructor() {
    super();
  }
}
