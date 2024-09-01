import { Processor, WorkerHost } from '@nestjs/bullmq';
import { TransactionsService } from '../transactions/services/transactions.service';
import { TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME } from './consts/queue.const';
import { TransactionCategoriseCommandDataDto } from './dto/transaction-categorise-command-data.dto';
import { OpenAIModel, OpenAIService } from '../externalservices/openai.service';
import { z } from 'zod';
import { TRANSACTION_CATEGORIES } from './consts/categories.const';
import { TRANSACTION_CATEGORISE_PROMPT } from './consts/prompt.const';

@Processor(TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME)
export class CategoriserProcessor extends WorkerHost {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly transactionsService: TransactionsService
  ) {
    super();
  }

  async process(job: { data: TransactionCategoriseCommandDataDto }) {
    const transactionId = job.data.transactionId;
    const transaction = await this.transactionsService.getOne(transactionId);

    const response = await this.openaiService.getJSONResponse(
      OpenAIModel.GPT4o,
      [{ role: 'user', content: `${TRANSACTION_CATEGORISE_PROMPT}: ${JSON.stringify(transaction)}` }],
      z.object({ category: z.enum(TRANSACTION_CATEGORIES) })
    );

    await this.transactionsService.updateCategory({
      transactionId: job.data.transactionId,
      category: response.category,
    });
  }
}
