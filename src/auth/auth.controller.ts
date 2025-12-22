import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateAdminProfileDto, UpdateTeacherProfileDto } from './dto/update-profile.dto';
import { AuthResponseDto, LogoutResponseDto, RefreshResponseDto } from './dto/auth-response.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  async logoutAdmin(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutAdmin(res);
  }

  @Post('admin/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Invalid refresh token' })
  async refreshAdminToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.adminRefreshToken;
    return this.authService.refreshAdminToken(refreshToken, res);
  }

  @Get('admin/me')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin profile' })
  @ApiResponse({ status: 200, description: 'Admin profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAdminProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.getAdminProfile(user.id);
  }

  @Patch('admin/me')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current admin profile' })
  @ApiBody({ type: UpdateAdminProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAdminProfile(
    @Req() req: Request,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    const user = req.user as { id: string };
    return this.authService.updateAdminProfile(user.id, dto);
  }

  @Post('teacher/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Teacher login (email or phone)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  async logoutTeacher(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutTeacher(res);
  }

  @Post('teacher/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh teacher access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Invalid refresh token' })
  async refreshTeacherToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.teacherRefreshToken;
    return this.authService.refreshTeacherToken(refreshToken, res);
  }

  @Get('teacher/me')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current teacher profile' })
  @ApiResponse({ status: 200, description: 'Teacher profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeacherProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.getTeacherProfile(user.id);
  }

  @Patch('teacher/me')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current teacher profile' })
  @ApiBody({ type: UpdateTeacherProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTeacherProfile(
    @Req() req: Request,
    @Body() dto: UpdateTeacherProfileDto,
  ) {
    const user = req.user as { id: string };
    return this.authService.updateTeacherProfile(user.id, dto);
  }
}
