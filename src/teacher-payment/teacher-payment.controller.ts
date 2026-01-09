import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TeacherPaymentService } from './teacher-payment.service';
import { AdminAuthGuard } from 'src/common/guards/jwtAdmin-auth.guard';
import { RolesGuard } from 'src/common/guards/jwtRoles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTeacherPaymentDto } from './dto/create-teacher-payment.dto';
import { CombinedAuthGuard } from 'src/common/guards/both/jwtCombinedAuth.guard';
import { TeacherSelfOrSuperAdminGuard } from 'src/common/guards/user/jwtTeacherSelf-superAdmin.guard';
import { UpdateTeacherPaymentDto } from './dto/update-teacher-payment.dto';
import { CancelTeacherPaymentDto } from './dto/cancel-teacher-payment.dto';

@ApiTags('Teacher Payments')
@ApiBearerAuth()
@Controller('teacher-payments')
export class TeacherPaymentController {
  constructor(private readonly teacherPaymentService: TeacherPaymentService) {}

  // ================= CREATE =================
  @Post()
  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Create teacher payment',
    description:
      'Creates a payment record for a completed lesson. Only admins are allowed.',
  })
  @ApiResponse({
    status: 201,
    description: 'Teacher payment successfully created',
  })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  @ApiResponse({ status: 404, description: 'Teacher or lesson not found' })
  @ApiResponse({
    status: 409,
    description: 'Payment already exists for lesson',
  })
  create(@Body() dto: CreateTeacherPaymentDto) {
    return this.teacherPaymentService.create(dto);
  }

  // ================= LIST =================
  @Get()
  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Get all teacher payments',
    description:
      'Returns paginated list of all teacher payments. Admin access only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher payments retrieved successfully',
  })
  findAll() {
    return this.teacherPaymentService.findAll();
  }

  // ================= GET ONE =================
  @Get(':id')
  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @ApiOperation({
    summary: 'Get teacher payment by ID',
    description:
      'Teachers can access their own payments. Super admins can access any.',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher payment ID',
    example: 'clx9abc123xyz',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher payment retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string) {
    return this.teacherPaymentService.findOne(id);
  }

  // ================= UPDATE =================
  @Patch(':id')
  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Update teacher payment',
    description:
      'Updates payment details. Canceled payments cannot be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher payment ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher payment updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherPaymentDto) {
    return this.teacherPaymentService.update(id, dto);
  }

  // ================= DELETE =================
  @Delete(':id')
  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete teacher payment',
    description: 'Soft deletes a teacher payment record.',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher payment deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string) {
    return this.teacherPaymentService.remove(id);
  }

  // ================= CANCEL =================
  @Patch(':id/cancel')
  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Cancel teacher payment',
    description:
      'Marks a payment as canceled and records cancellation details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Teacher payment ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher payment canceled successfully',
  })
  @ApiResponse({ status: 409, description: 'Payment already canceled' })
  cancelPayment(@Param('id') id: string, @Body() dto: CancelTeacherPaymentDto) {
    return this.teacherPaymentService.cancel(
      id,
      dto.canceledBy,
      dto.canceledReason,
    );
  }
}
