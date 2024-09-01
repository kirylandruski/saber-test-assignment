import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CategorizerService } from './categorizer.service';
import { CategorizerProcessor } from './categorizer.processor';
import { TransactionsService } from '../transactions/services/transactions.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME } from './queue.const';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';

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
    BullModule.registerQueue({ name: TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME }),
    forwardRef(() => TransactionsModule),
  ],
  providers: [CategorizerService, CategorizerProcessor],
  exports: [CategorizerService],
})
export class CategorizerModule {}
