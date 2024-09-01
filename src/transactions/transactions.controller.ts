import { Controller, Get, Post, Query, Body, Param, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionModel } from './models/transaction.model';
import { QueryTransactionsDto } from './dtos/query-transactions.dto';
import { GetTransactionDto } from './dtos/get-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAll(@Query() query: QueryTransactionsDto): Promise<GetTransactionDto[]> {
    const transactions = await this.transactionsService.getAll({
      limit: query.limit,
      after: query.after,
    });

    return transactions.map((transaction) => transaction.toDto());
  }

  @Get(':transactionId')
  async getOne(@Param('transactionId') transactionId: string): Promise<GetTransactionDto> {
    const transaction = await this.transactionsService.getOne(transactionId);
    if (!transaction) {
      throw new NotFoundException();
    }
    return transaction.toDto();
  }

  @Post()
  async create(@Body() body: CreateTransactionDto): Promise<void> {
    const transaction = TransactionModel.fromDto(body);
    await this.transactionsService.create(transaction);
  }
}
