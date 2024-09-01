import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TransactionCategoriserService } from './transaction-categoriser.service';
import { CategoriserProcessor } from './categoriser.processor';
import { TransactionsModule } from '../transactions/transactions.module';
import { TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME } from './consts/queue.const';
import { AppConfigModule } from '../appconfig/app-config.module';
import { AppConfigService } from '../appconfig/app-config.service';
import { ExternalServicesModule } from '../externalservices/externalservices.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        connection: {
          host: configService.redisHost,
          port: configService.redisPort,
        },
      }),
      inject: [AppConfigService],
    }),
    BullModule.registerQueue({ name: TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME }),
    forwardRef(() => TransactionsModule),
    ExternalServicesModule,
  ],
  providers: [TransactionCategoriserService, CategoriserProcessor],
  exports: [TransactionCategoriserService],
})
export class CategoriserModule {}
