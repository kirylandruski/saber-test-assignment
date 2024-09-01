import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly redisHost: string;
  public readonly redisPort: number;
  public readonly mongoDbUrl: string;
  public readonly port: number;

  constructor(private nestConfigService: NestConfigService) {
    this.redisHost = this.nestConfigService.getOrThrow<string>('REDIS_HOST');
    this.redisPort = this.nestConfigService.getOrThrow<number>('REDIS_PORT');
    this.mongoDbUrl = this.nestConfigService.getOrThrow<string>('MONGODB_URL');
    this.port = this.nestConfigService.getOrThrow<number>('PORT');
  }
}
