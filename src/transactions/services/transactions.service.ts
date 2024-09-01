import { Injectable } from '@nestjs/common';
import { TransactionModel } from '../models/transaction.model';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategorizerService } from '../../categorizer/categorizer.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categorizerService: CategorizerService
  ) {}

  async getAll({ limit, after }: { limit: number; after?: string }): Promise<TransactionModel[]> {
    return this.transactionRepository.findAll({ limit, after });
  }

  async getOne(transactionId: string): Promise<TransactionModel | null> {
    return this.transactionRepository.findOne(transactionId);
  }

  async create(model: TransactionModel): Promise<void> {
    await this.transactionRepository.create(model);
    await this.categorizerService.scheduleTransactionCategorize(model.transactionId);
  }

  async updateCategory({ transactionId, category }: { transactionId: string; category: string }): Promise<void> {
    await this.transactionRepository.updateCategory({ transactionId, category });
  }
}
