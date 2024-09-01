import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME,
  TRANSACTION_CATEGORISE_COMMAND_RETRY_OPTIONS,
  TRANSACTION_CATEGORISE_JOB_NAME,
} from './consts/queue.const';
import { TransactionCategoriseCommandDataDto } from './dto/transaction-categorise-command-data.dto';

@Injectable()
export class TransactionCategoriserService {
  constructor(@InjectQueue(TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME) private queue: Queue) {}

  async scheduleTransactionCategorise(transactionId: string) {
    await this.queue.add(
      TRANSACTION_CATEGORISE_JOB_NAME,
      { transactionId } as TransactionCategoriseCommandDataDto,
      TRANSACTION_CATEGORISE_COMMAND_RETRY_OPTIONS
    );
  }
}
