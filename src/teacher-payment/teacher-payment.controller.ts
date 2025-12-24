import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeacherPaymentService } from './teacher-payment.service';
import { CreateTeacherPaymentDto } from './dto/create-teacher-payment.dto';
import { UpdateTeacherPaymentDto } from './dto/update-teacher-payment.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import { RolesGuard } from '../common/guards/jwtRoles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CombinedAuthGuard } from '../common/guards/both/jwtCombinedAuth.guard';
import { TeacherSelfOrSuperAdminGuard } from '../common/guards/user/jwtTeacherSelf-superAdmin.guard';

@ApiTags('Teacher Payments') 
@Controller('teacher-payment')
@ApiBearerAuth()
export class TeacherPaymentController {
  constructor(private readonly teacherPaymentService: TeacherPaymentService) {}

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new teacher payment' })
  @ApiResponse({ status: 201, description: 'Payment successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createTeacherPaymentDto: CreateTeacherPaymentDto) {
    return this.teacherPaymentService.create(createTeacherPaymentDto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all teacher payments' })
  @ApiResponse({ status: 200, description: 'Return all payments.' })
  findAll() {
    return this.teacherPaymentService.findAll();
  }

  @UseGuards(CombinedAuthGuard, TeacherSelfOrSuperAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific payment by ID' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the payment' })
  @ApiResponse({ status: 200, description: 'Return the payment record.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  findOne(@Param('id') id: string) {
    return this.teacherPaymentService.findOne(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing payment' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully.' })
  update(
    @Param('id') id: string,
    @Body() updateTeacherPaymentDto: UpdateTeacherPaymentDto,
  ) {
    return this.teacherPaymentService.update(id, updateTeacherPaymentDto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment record' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.teacherPaymentService.remove(id);
  }
}
