import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionModel as TransactionModel } from '../models/transaction.model';
import { TransactionDocument } from '../schemas/transaction.schema';
import dayjs from 'dayjs';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(TransactionDocument.name)
    private transactionModel: Model<TransactionDocument>
  ) {}

  async findAll({ limit, after }: { limit: number; after?: string }): Promise<TransactionModel[]> {
    const filter = after ? { _id: { $gt: after } } : {};

    const transactions = await this.transactionModel.find(filter).limit(limit).lean().exec();
    return transactions.map((transaction) => TransactionRepository.mapToModel(transaction));
  }

  async findOne(transactionId: string): Promise<TransactionModel | null> {
    const transaction = await this.transactionModel.findById(transactionId).exec();

    if (!transaction) {
      return null;
    }

    return TransactionRepository.mapToModel(transaction);
  }

  async create(transaction: TransactionModel): Promise<void> {
    await this.transactionModel.create(TransactionRepository.mapToDocument(transaction));
  }

  async updateCategory({ transactionId, category }: { transactionId: string; category: string }): Promise<void> {
    await this.transactionModel.updateOne({ _id: transactionId }, { $set: { category } }).exec();
  }

  private static mapToModel(document: TransactionDocument): TransactionModel {
    return new TransactionModel(
      document._id,
      document.amount,
      dayjs(document.timestamp),
      document.description,
      document.transactionType,
      document.accountNumber,
      document.category
    );
  }

  private static mapToDocument(model: TransactionModel): Partial<TransactionDocument> {
    return {
      _id: model.transactionId,
      amount: model.amount,
      timestamp: model.timestamp.toDate(),
      description: model.description,
      transactionType: model.transactionType,
      accountNumber: model.accountNumber,
      category: model.category,
    };
  }
}
