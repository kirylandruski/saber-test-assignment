import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionDocument, TransactionSchema } from './schemas/transaction.schema';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: TransactionDocument.name, schema: TransactionSchema }])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
})
export class TransactionsModule {}
