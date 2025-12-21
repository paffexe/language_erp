import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, LogoutResponseDto, RefreshResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account is not active' })
  async loginAdmin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginAdmin(dto, res);
  }

  @Post('admin/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin logout' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: LogoutResponseDto })
  async logoutAdmin(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutAdmin(res);
  }

  @Post('admin/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: RefreshResponseDto })
  @ApiResponse({ status: 403, description: 'Invalid refresh token' })
  async refreshAdminToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.adminRefreshToken;
    return this.authService.refreshAdminToken(refreshToken, res);
  }

  @Post('teacher/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Teacher login (email or phone)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account is not active' })
  async loginTeacher(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginTeacher(dto, res);
  }

  @Post('teacher/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Teacher logout' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: LogoutResponseDto })
  async logoutTeacher(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutTeacher(res);
  }

  @Post('teacher/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh teacher access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: RefreshResponseDto })
  @ApiResponse({ status: 403, description: 'Invalid refresh token' })
  async refreshTeacherToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.teacherRefreshToken;
    return this.authService.refreshTeacherToken(refreshToken, res);
  }
}
