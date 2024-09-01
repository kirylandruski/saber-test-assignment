import { Injectable } from '@nestjs/common';
import { TransactionModel } from '../models/transaction.model';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getAll({ limit, after }: { limit: number; after?: string }): Promise<TransactionModel[]> {
    return this.transactionRepository.findAll({ limit, after });
  }

  async getOne(transactionId: string): Promise<TransactionModel | null> {
    return this.transactionRepository.findOne(transactionId);
  }

  async create(model: TransactionModel): Promise<void> {
    return this.transactionRepository.create(model);
  }
}
