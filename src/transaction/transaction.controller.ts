import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionListResponseDto } from './dto/transaction-list-response.dto';
import { FindTransactionsDto } from './dto/find-transaction.dto';
import { AdminAuthGuard } from '../common/guards/jwtAdmin-auth.guard';
import { RolesGuard } from '../common/guards/jwtRoles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction successfully created',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Lesson or student not found' })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({
    summary: 'Get all transactions with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: TransactionListResponseDto,
  })
  findAll(@Query() query: FindTransactionsDto) {
    return this.transactionService.findAll(query);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all transactions for a specific student' })
  @ApiParam({ name: 'studentId', type: String, description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'List of student transactions',
    type: [TransactionResponseDto],
  })
  getStudentTransactions(@Param('studentId') studentId: string) {
    return this.transactionService.getStudentTransactions(studentId);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all transactions for a specific lesson' })
  @ApiParam({ name: 'lessonId', type: String, description: 'Lesson ID' })
  @ApiResponse({
    status: 200,
    description: 'List of lesson transactions',
    type: [TransactionResponseDto],
  })
  getLessonTransactions(@Param('lessonId') lessonId: string) {
    return this.transactionService.getLessonTransactions(lessonId);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction successfully updated',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a transaction' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction cancelled',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Transaction already cancelled' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  cancelTransaction(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.transactionService.cancelTransaction(id, reason);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a transaction' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction completed',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Transaction already completed' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  completeTransaction(@Param('id') id: string) {
    return this.transactionService.completeTransaction(id);
  }

  @UseGuards(AdminAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiParam({ name: 'id', type: String, description: 'Transaction ID' })
  @ApiResponse({ status: 204, description: 'Transaction deleted' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}


