import { Processor, WorkerHost } from '@nestjs/bullmq';
import { TransactionsService } from '../transactions/services/transactions.service';
import { TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME } from './queue.const';

@Processor(TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME)
export class CategorizerProcessor extends WorkerHost {
  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }

  async process(job: any) {
    await this.transactionsService.updateCategory({
      transactionId: job.data.transactionId,
      category: 'any',
    });
  }
}
