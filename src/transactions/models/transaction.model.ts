import { TransactionDto } from '../dtos/transaction.dto';
import utc from 'dayjs/plugin/utc';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(utc);

export class TransactionModel {
  constructor(
    public transactionId: string,
    public amount: string,
    public timestamp: Dayjs,
    public description: string,
    public transactionType: string,
    public accountNumber: string
  ) {}

  static fromDto(dto: TransactionDto): TransactionModel {
    return new TransactionModel(
      dto.transactionId,
      dto.amount,
      dayjs.utc(dto.timestamp, 'YYYY-MM-DD HH:mm:ss'),
      dto.description,
      dto.transactionType,
      dto.accountNumber
    );
  }

  toDto(): TransactionDto {
    return {
      transactionId: this.transactionId,
      amount: this.amount,
      timestamp: this.timestamp.utc().format('YYYY-MM-DD HH:mm:ss'),
      description: this.description,
      transactionType: this.transactionType,
      accountNumber: this.accountNumber,
    };
  }
}
