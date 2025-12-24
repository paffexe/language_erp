import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { DeletedTeacherService } from './deleted-teacher.service';
import { CreateDeletedTeacherDto } from './dto/create-deleted-teacher.dto';
import { UpdateDeletedTeacherDto } from './dto/update-deleted-teacher.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('Deleted Teacher Management')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard) 
@Controller('deleted-teacher')
export class DeletedTeacherController {
  constructor(private readonly deletedTeacherService: DeletedTeacherService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a deleted teacher record',
    description:
      'Creates a record in the deleted teachers archive. Requires admin privileges.',
  })
  @ApiBody({
    type: CreateDeletedTeacherDto,
    description: 'Data for creating a deleted teacher record',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deleted teacher record created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Record already exists',
  })
  @ApiSecurity('JWT-admin-auth')
  create(@Body() createDeletedTeacherDto: CreateDeletedTeacherDto) {
    return this.deletedTeacherService.create(createDeletedTeacherDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all deleted teacher records',
    description:
      'Retrieves all archived/deleted teacher records. Requires admin privileges.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all deleted teacher records',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No deleted teacher records found',
  })
  @ApiSecurity('JWT-admin-auth')
  findAll() {
    return this.deletedTeacherService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific deleted teacher record',
    description:
      'Retrieves a single deleted teacher record by ID. Requires admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the deleted teacher record',
    type: String,
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the deleted teacher record',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deleted teacher record not found',
  })
  @ApiSecurity('JWT-admin-auth')
  findOne(@Param('id') id: string) {
    return this.deletedTeacherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a deleted teacher record',
    description:
      'Updates an existing deleted teacher record. Requires admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the deleted teacher record to update',
    type: String,
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateDeletedTeacherDto,
    description: 'Data to update the deleted teacher record',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted teacher record updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or ID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deleted teacher record not found',
  })
  @ApiSecurity('JWT-admin-auth')
  update(
    @Param('id') id: string,
    @Body() updateDeletedTeacherDto: UpdateDeletedTeacherDto,
  ) {
    return this.deletedTeacherService.update(id, updateDeletedTeacherDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Permanently delete a record',
    description:
      'Permanently deletes a record from the deleted teachers archive. This action cannot be undone. Requires admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the deleted teacher record to permanently delete',
    type: String,
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Record permanently deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deleted teacher record not found',
  })
  @ApiSecurity('JWT-admin-auth')
  remove(@Param('id') id: string) {
    return this.deletedTeacherService.remove(id);
  }
}
