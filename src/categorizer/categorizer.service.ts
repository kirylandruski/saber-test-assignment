import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME,
  TRANSACTION_CATEGORIZE_COMMAND_RETRY_OPTIONS,
  TRANSACTION_CATEGORIZE_JOB_NAME,
} from './consts/queue.const';
import { TransactionCategorizeCommandDataDto } from './dto/transaction-categorize-command-data.dto';

@Injectable()
export class CategorizerService {
  constructor(@InjectQueue(TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME) private queue: Queue) {}

  async scheduleTransactionCategorize(transactionId: string) {
    await this.queue.add(
      TRANSACTION_CATEGORIZE_JOB_NAME,
      { transactionId } as TransactionCategorizeCommandDataDto,
      TRANSACTION_CATEGORIZE_COMMAND_RETRY_OPTIONS
    );
  }
}
