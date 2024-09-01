import { Module } from '@nestjs/common';
import { AppConfigModule } from './appconfig/app-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from './appconfig/app-config.service';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.mongoDbUrl,
      }),
      inject: [AppConfigService],
    }),
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
