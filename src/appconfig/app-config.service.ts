import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly port: number;
  public readonly redisHost: string;
  public readonly redisPort: number;
  public readonly mongoDbUrl: string;
  public readonly openaiKey: string;

  constructor(private nestConfigService: NestConfigService) {
    this.port = this.nestConfigService.getOrThrow<number>('PORT');
    this.redisHost = this.nestConfigService.getOrThrow<string>('REDIS_HOST');
    this.redisPort = this.nestConfigService.getOrThrow<number>('REDIS_PORT');
    this.mongoDbUrl = this.nestConfigService.getOrThrow<string>('MONGODB_URL');
    this.openaiKey = this.nestConfigService.getOrThrow<string>('OPENAI_KEY');
  }
}
