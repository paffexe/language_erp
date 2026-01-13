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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService, GoogleUser } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import {
  UpdateAdminProfileDto,
  UpdateTeacherProfileDto,
} from './dto/update-profile.dto';
import {
  AuthResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
} from './dto/auth-response.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import { AdminRefreshTokenGuard } from '../common/guards/jwtAdmin-refreshToken.guard';
import { UserRefreshTokenGuard } from '../common/guards/user/jwtUser-refreshToken.guard';
import { CombinedAuthGuard } from '../common/guards/both/jwtCombinedAuth.guard';
import { AdminSelfOrSuperAdminGuard } from '../common/guards/jwtAdminSelf-superAdmin.guard';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { TeacherAuthGuard } from '../common/guards/teacher-auth.guard';

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

  @UseGuards(AdminRefreshTokenGuard)
  @Post('admin/logout')
  @ApiBearerAuth()
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

  @UseGuards(AdminRefreshTokenGuard)
  @Post('admin/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
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

  @UseGuards(AdminAuthGuard)
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

  @UseGuards(AdminAuthGuard, AdminSelfOrSuperAdminGuard)
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

  @UseGuards(UserRefreshTokenGuard)
  @Post('teacher/logout')
  @ApiBearerAuth()
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

  @UseGuards(UserRefreshTokenGuard)
  @Post('teacher/refresh')
  @ApiBearerAuth()
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

  @UseGuards(CombinedAuthGuard)
  @Get('teacher/me')
  @UseGuards(TeacherAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current teacher profile' })
  @ApiResponse({ status: 200, description: 'Teacher profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTeacherProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.getTeacherProfile(user.id);
  }

  @UseGuards(CombinedAuthGuard)
  @Patch('teacher/me')
  @UseGuards(TeacherAuthGuard)
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

  // ==================== GOOGLE OAUTH ====================

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth login - redirects to Google' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  async googleAuth() {
    // Guard handles redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.googleLogin(
      req.user as GoogleUser,
      res,
    );

    return res.redirect(result.redirectUrl);
  }

  @Post('teacher/send-otp')
  @UseGuards(TeacherAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Telefon raqamga OTP yuborish' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP yuborildi' })
  @ApiResponse({ status: 400, description: 'Telefon raqam allaqachon mavjud' })
  async sendOtp(@Req() req: Request, @Body() dto: SendOtpDto) {
    const user = req.user as { id: string };
    return this.authService.sendOtp(
      dto.phoneNumber,
      user.id,
      dto.password,
      dto.confirmPassword,
    );
  }

  @Post('teacher/verify-otp')
  @UseGuards(TeacherAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'OTP kodni tasdiqlash' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Telefon raqam tasdiqlandi' })
  @ApiResponse({
    status: 400,
    description: "OTP noto'g'ri yoki muddati tugagan",
  })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyOtp(dto.phoneNumber, dto.otp, res);
  }

  @Post('teacher/resend-otp')
  @UseGuards(TeacherAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'OTP kodni qayta yuborish' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP qayta yuborildi' })
  async resendOtp(@Req() req: Request, @Body() dto: SendOtpDto) {
    const user = req.user as { id: string };
    return this.authService.resendOtp(dto.phoneNumber, user.id);
  }
}
