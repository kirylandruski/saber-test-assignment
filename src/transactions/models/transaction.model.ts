import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import utc from 'dayjs/plugin/utc';
import dayjs, { Dayjs } from 'dayjs';
import { GetTransactionDto } from '../dtos/get-transaction.dto';

dayjs.extend(utc);

export class TransactionModel {
  constructor(
    public transactionId: string,
    public amount: string,
    public timestamp: Dayjs,
    public description: string,
    public transactionType: string,
    public accountNumber: string,
    public category: string | null
  ) {}

  static fromDto(dto: CreateTransactionDto): TransactionModel {
    return new TransactionModel(
      dto.transactionId,
      dto.amount,
      dayjs.utc(dto.timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS'),
      dto.description,
      dto.transactionType,
      dto.accountNumber,
      null
    );
  }

  toDto(): GetTransactionDto {
    return {
      transactionId: this.transactionId,
      amount: this.amount,
      timestamp: this.timestamp.utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
      description: this.description,
      transactionType: this.transactionType,
      accountNumber: this.accountNumber,
      category: this.category,
    };
  }
}
