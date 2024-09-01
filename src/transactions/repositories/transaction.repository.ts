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
    const createdTransaction = new this.transactionModel(TransactionRepository.mapToDocument(transaction));
    await createdTransaction.save();
  }

  async update(transactionId: string, transaction: TransactionModel): Promise<TransactionModel> {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(transactionId, TransactionRepository.mapToDocument(transaction), { new: true })
      .exec();

    if (!updatedTransaction) {
      return null;
    }

    return TransactionRepository.mapToModel(updatedTransaction);
  }

  private static mapToModel(document: TransactionDocument): TransactionModel {
    return new TransactionModel(
      document._id,
      document.amount,
      dayjs(document.timestamp),
      document.description,
      document.transactionType,
      document.accountNumber
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
    };
  }
}
