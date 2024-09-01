import { Module } from '@nestjs/common';
import { AppConfigModule } from '../appconfig/app-config.module';
import { OpenAIService } from './openai.service';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class ExternalServicesModule {}
